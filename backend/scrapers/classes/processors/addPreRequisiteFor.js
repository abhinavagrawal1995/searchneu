/*
 * This file is part of Search NEU and licensed under AGPL3.
 * See the license file in the root folder for details.
 */

import _ from 'lodash';
import BaseProcessor from './baseProcessor';
import Keys from '../../../../common/Keys';

/**
 * Adds the prerequsite-for field for classes that are a predecessor for
 * other classes.
 */
class AddPreRequisiteFor extends BaseProcessor.BaseProcessor {
  classMap = {};

  /**
   * Creates a class hash map based on the term dump, then calls parse every
   * request to link data.
   *
   * @param {Term Dump} termDump the termDump of the semester.
   */
  go(termDump) {
    for (const aClass of termDump.classes) {
      const key = Keys.create(aClass).getHash();
      this.classMap[key] = aClass;
    }

    for (const aClass of termDump.classes) {
      if (aClass.prereqs) {
        this.parsePreReqs(aClass, aClass.prereqs, true);
      }

      this.sortPreReqs(aClass);
    }
  }

  /* A Prerequisite is one of:
   * - String
   * - Class
   * - [Prerequsite]
   */

  /**
   * Recursively traverse the prerequsite structure.
   *
   * @param {Class Object} mainClass - the class that we're checking the
   * prereqs for. If it has a prereq, we add this class to the prereq's
   * optPrereqFor field.
   * @param {Prerequisite} node - a prerequsite class of mainClass. This is
   * the field where we add the mainClass information to.
   * @param {Boolean} isRequired - whether or not the prerequisite is required.
   */
  parsePreReqs(mainClass, node, isRequired) {
    if (node && node.missing) {
      return;
    }

    // Get the the class we wish to refere to
    if (this.isClass(node)) {
      const find = Keys.create({
        host: mainClass.host,
        termId: mainClass.termId,
        subject: node.subject,
        classUid: node.classUid,
      }).getHash();

      const nodeRef = this.classMap[find];

      this.initializeArray(nodeRef);

      const classData = {
        subject: mainClass.subject,
        classUid: mainClass.classUid,
        classId: mainClass.classId,
      };

      if (isRequired) {
        nodeRef.prereqsFor.values.unshift(classData);
      } else {
        nodeRef.optPrereqsFor.values.unshift(classData);
      }
    } else {
      const classType = node.type;

      if (node.values !== undefined) {
        node.values.map((course) => {
          // A required course becomes effectively optional when we encounter
          // an 'or' in our tree.
          const reqType = (classType === 'and') ? isRequired : false;
          return this.parsePreReqs(mainClass, course, reqType);
        });
      }
    }
  }

  /**
   * Creates the fields 'optPrereqsFor' and 'prereqsFor' in nodeRef, if and
   * only if they haven't been initialized already.
   *
   * @param {Class} nodeRef the class in our tree that we're creating the
   * arrays for.
   */
  initializeArray(nodeRef) {
    // Checks and creates the optPrereqsFor field in our class, if needed
    if (nodeRef.optPrereqsFor === undefined) {
      nodeRef.optPrereqsFor = {
        values: [],
      };
    }
    if (nodeRef.prereqsFor === undefined) {
      nodeRef.prereqsFor = {
        values: [],
      };
    }
  }

  /**
   * Recursively traverse the prerequsite structure.
   *
   * @param {Class} node - a prerequsite class of mainClass. This is
   * the field where we add the mainClass information to.
   */
  sortPreReqs(node) {
    const find = Keys.create(node).getHash();

    const nodeRef = this.classMap[find];
    if (nodeRef.optPrereqsFor && nodeRef.optPrereqsFor.values) {
      const partitioned = _.partition(nodeRef.optPrereqsFor.values, (prereq) => {
        return prereq.subject === nodeRef.subject;
      });
      const filtered = partitioned[0];

      const nonFiltered = partitioned[1];

      filtered.push(...nonFiltered);

      nodeRef.optPrereqsFor.values = filtered;
    }
  }

  // Prerequisite -> Boolean
  // Checks if a prerequisite is a class or not
  isClass(prereq) {
    return Object.prototype.hasOwnProperty.call(prereq, 'subject');
  }
}

export default new AddPreRequisiteFor();
