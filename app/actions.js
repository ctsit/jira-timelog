'use strict';

let jira = require('./jira');

module.exports = {

  printCurrentIssue: (options) => {
    let issuesPromise = jira.getUsersIssues()
    issuesPromise.then((issues) => {
      for (var i = 0; i < issues.length; i++) {
        console.log(issues[i].key + '  ' + issues[i].name)
      }
    }).catch((err) => {
      console.err(err)
    })
  },

  logWork: (issueId, time, message, options) => {
    let newWorkLogPromise = jira.addNewWorklog(issueId, time, message, options.date)
    newWorkLogPromise.then(() => {
      console.log('Work was logged successfully')
    }).catch((err) => {
      console.log('Work was not logged successfully')
      console.error(err)
    })
  },

  getLoggedWork: (date, options) => {
    let workLogPromise = jira.getWorkLog(date, options.project)
    workLogPromise.then((workLogs) => {
      for (var i = 0; i < workLogs.length; i++) {
        console.log(workLogs[i].issueId + '   ' + workLogs[i].timeSpent + '   ' + workLogs[i].comment)
      }
    }).catch((err) => {
      console.error(err)
    })
  }

}
