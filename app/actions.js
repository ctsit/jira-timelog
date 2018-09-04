'use strict';

let jira = require('./jira');

module.exports = {

  printCurrentTask: (options) => {
    let issuesPromise = jira.getUsersTasks()
    issuesPromise.then((tasks) => {
      for (var i = 0; i < tasks.length; i++) {
        console.log(tasks[i].key + '  ' + tasks[i].name)
      }
    }).catch((err) => {
      console.err(err)
    })
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
