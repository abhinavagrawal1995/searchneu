/*
 * This file is part of Search NEU and licensed under AGPL3.
 * See the license file in the root folder for details.
 */

import addPreRequisiteFor from '../addPreRequisiteFor';
import Keys from '../../../../../common/Keys';

describe('addPreRequisiteFor tests', () => {
  const cs2500 = {
    classId: '2500',
    termId: '201829',
    host: 'neu.edu',
  };

  const cs2510 = {
    prereqs: {
      type: 'or',
      values: [{
        subject: 'CS',
        classUid: '2500_699845913',
        classId: '2500',
      }],
    },
    coreqs: {
      type: 'or',
      values: [{
        subject: 'CS',
        classUid: '2511_803118792',
        classId: '2511',
      }],
    },
    classId: '2510',
    termId: '201830',
    subject: 'CS',
  };

  const fakeClass1 = {
    optPrereqsFor:
      {
        values: [
          {
            subject: 'CS',
            classUid: '2500_699845913',
            classId: '5',
          }, {
            subject: 'MATH',
            classUid: '2500_699845913',
            classId: '2',
          }, {
            subject: 'EECE',
            classUid: '2500_699845913',
            classId: '11',
          }, {
            subject: 'EECE',
            classUid: '2500_699845913',
            classId: '7',
          },
          {
            subject: 'MATH',
            classUid: '2500_699845913',
            classId: '3',
          },
        ],
      },
    classId: '2510',
    termId: '201830',
    classUid: '33333333',
    subject: 'CS',
    host: 'neu.edu',
  };

  const fakeClass2 = {
    prereqsFor:
      {
        values: [
          {
            subject: 'CS',
            classUid: '2500_699845913',
            classId: '5',
          }, {
            subject: 'MATH',
            classUid: '2500_699845913',
            classId: '2',
          }, {
            subject: 'EECE',
            classUid: '2500_699845913',
            classId: '11',
          }, {
            subject: 'EECE',
            classUid: '2500_699845913',
            classId: '7',
          },
          {
            subject: 'MATH',
            classUid: '2500_699845913',
            classId: '3',
          },
        ],
      },
    classId: '2510',
    termId: '201830',
    classUid: '33333333',
    subject: 'EECE',
    host: 'neu.edu',
  };

  const termDump = {
    classes: [cs2500, cs2510, fakeClass1],
    sections: [],
  };

  it('should load in termDump', () => {
    addPreRequisiteFor.termDump = termDump;
    expect(addPreRequisiteFor.termDump).toBe(termDump);
  });

  describe('parseClass tests', () => {
    const outputPreReqClass = cs2500;
    outputPreReqClass.prereqsFor = [];
    outputPreReqClass.prereqsFor.push(cs2510);
  });


  it('should sort some optPrereqsFor', () => {
    addPreRequisiteFor.termDump = termDump;
    const hash = Keys.create(fakeClass1).getHash();
    addPreRequisiteFor.classMap[hash] = fakeClass1;

    addPreRequisiteFor.sortPreReqs(fakeClass1);

    expect(fakeClass1.optPrereqsFor).toMatchSnapshot();
  });


  it('should sort some prereqsFor', () => {
    addPreRequisiteFor.termDump = termDump;
    const hash = Keys.create(fakeClass2).getHash();
    addPreRequisiteFor.classMap[hash] = fakeClass2;

    addPreRequisiteFor.sortPreReqs(fakeClass2);

    expect(fakeClass2.prereqsFor).toMatchSnapshot();
  });
});
