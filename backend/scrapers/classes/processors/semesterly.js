import _ from 'lodash';
import fs from 'fs-promise';

import macros from '../../../macros';
import Section from '../../../../common/classModels/Section'

// Dumps the data in the semester.ly schema

class Semesterly {

  async main(dump) {
    let result = []      
    let meetings = []

    let subjectMap = {}
    for (let subject of dump.subjects) {
      subjectMap[subject.subject] = subject.text
    }


    let classMap = {}
    for (let aClass of dump.classes) {
      classMap[aClass.classUid] = aClass
    }

    for (let aClass of dump.classes) {
      if (aClass.host !== 'neu.edu') {
        continue;
      }
      
      // Skip all the other terms for now too
      if (aClass.termId !== '201810') {
        continue;
      }

      result.push({
        kind: 'course',
        code: aClass.subject + ' ' + aClass.classId,
        credits: aClass.maxCredits,
        department: {
          code: aClass.subject,
          name: subjectMap[aClass.subject]
        },
        name: aClass.name,
        prerequisites: [''], // todo
        description: aClass.termId + aClass.desc, // todo: add corequisites to the end of this
        school: {
          'code': 'neu'
        }
      })
    }


    for (let section of dump.sections) {

      // Skip all the neu.edu/law and neu.edu/cps for now
      if (section.host !== 'neu.edu') {
        continue;
      }

      // Skip all the other terms for now too
      if (section.termId !== '201810') {
        continue;
      }

      let instance = Section.create(section)

      let professors = instance.getProfs()
      let code = section.subject + ' ' + section.classId

      // Semester.ly groups meetings by the start and end time of the meeting on each day of the week
      // so we need to get a list of all the meetings for each section and then re-group them
      // by start/end time
      // The key for this is just start+end (eg. "08:0010:00" (army time))
      let meetingsByStartEndTime = {}

      const dayCodes = ["U", "M", "T", "W", "R", "F", "S"]

      if (instance.meetings) {
        for (let meeting of instance.meetings) {

          // TODO make this work
          if (meeting.getIsExam()) {
            continue;
          }

          let times = _.flatten(meeting.times);

          for (let time of times) {
            let start = time.start.format('HH:mm')
            let end = time.end.format("HH:mm")
            let dayOfWeek = parseInt(time.start.format('d'))

            // Small sanity check
            if (dayOfWeek !== parseInt(time.end.format('d'))) {
              macros.error("Meeting ends on a different day than it starts?", instance.termId, instance.classUid, instance.subject)
            }

            let key = start+end;
            if (!meetingsByStartEndTime[key]) {
              meetingsByStartEndTime[key] = {
                kind: 'meeting',
                course: {
                  code: code
                },
                days: [],
                location: {
                  where: meeting.where
                },
                section: {
                  code: section.crn,
                  term: section.termId,
                  year: '2017'
                },
                time: {
                  start: start,
                  end: end
                }
              }
            }

            meetingsByStartEndTime[key].days.push(dayCodes[dayOfWeek])
            meetingsByStartEndTime[key].days = _.uniq(meetingsByStartEndTime[key].days)
          }
        }
      }

      // Add all the meetings
      meetings = meetings.concat(Object.values(meetingsByStartEndTime))

      professors = professors.map(function (name) {
        return {
          name: name
        }
      })

      result.push({
        capacity: section.seatsCapacity,
        code: section.crn,
        course: {
          code: code
        },
        enrollment: section.seatsCapacity - section.seatsRemaining,
        instructors: professors,
        year: '2017',
        kind: 'section',
        term: section.termId
      })
    }



    let retVal = {
      "$data": result.concat(meetings),
       "$meta": {
        "$schools": {
          "neu": {
            "2017": [
              "201730",
              "201740",
              "201750",
              "201760",
              "201810"
            ]
          }
        },
        "$timestamp": Date.now()/1000
      }
    }


    let exists = await fs.exists('parsing/schools/neu/data/')

    if (!exists) {
      macros.error('parsing/schools/neu/data/ does not exist, exiting')
      return;
    }

    
    let semesterlyString = JSON.stringify(retVal, null, 4)
    await fs.writeFile('parsing/schools/neu/data/courses.json', semesterlyString)
    macros.log('saved semesterly data')
  }
}


const instance = new Semesterly();

if (require.main === module) {
  
}

export default instance;
