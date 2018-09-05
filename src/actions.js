'use strict'

let jira = require('./jira')

const ISO_REGEX = new RegExp('^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])$')

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
    if (options.date && !ISO_REGEX.test(options.date)) {
      console.log('Please use a correct date in the form of YYYY-MM-DD')
      return
    }
    let newWorkLogPromise = jira.addNewWorklog(issueId, time, message, options.date)
    newWorkLogPromise.then((ids) => {
      console.log(ids.issueId + ' ' + ids.worklogId)
      process.exit(0)
    }).catch((err) => {
      console.log('Work was not logged successfully')
      console.error(err)
      process.exit(1)
    })
  },

  getLoggedWork: (date, options) => {
    if (!ISO_REGEX.test(date)) {
      console.log('Please use a correct date in the form of YYYY-MM-DD')
      return
    }

    let workLogPromise = jira.getWorkLog(date, options.project)
    workLogPromise.then((workLogs) => {
      for (var i = 0; i < workLogs.length; i++) {
        console.log(workLogs[i].issueId + '   ' + workLogs[i].timeSpent + '   ' + workLogs[i].comment)
      }
    }).catch((err) => {
      console.error(err)
    })
  },

  deleteWorklog: (issueId, worklogId) => {
    let worklogDeletePromise = jira.deleteWorklog(issueId, worklogId)
    worklogDeletePromise.then((result) => {
      process.exit(0)
    }).catch((err) => {
      console.error(err)
      process.exit(1)
    })
  }

}
