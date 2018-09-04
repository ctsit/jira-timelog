'use strict';

let jira = require('./jira');

module.exports = {

  printCurrentTask: (options) => {
    // Prints the issue ID and name to console.
    jira.getUsersTasks();
  },

  logWork: (taskId, time, message, options) => {
    console.log(taskId)
    console.log(time)
    console.log(message)
    console.log(options)
  },

  getLoggedWork: (date, options) => {
    console.log(date)
    console.log(options)
  }

}
