'use strict'

const https = require('https')
const moment = require('moment')

const HEADERS = {
  'Authorization': 'Basic ' + Buffer.from(process.env.JTL_USERNAME + ':' + process.env.JTL_PASS).toString('base64'),
  'Content-Type': 'application/json'
}

module.exports = {

  getUsersIssues: () => {
    // Return a promise since the GET request is async
    let issuesPromise = new Promise((resolve, reject) => {
      // Uses JIRA's JQL language to get all open issues for the current user
      const request = https.get({
        hostname: 'jira.ctsi.ufl.edu',
        path: encodeURI('/rest/api/2/search?jql=assignee=currentuser() AND (status!=DONE AND status !=CLOSED)'),
        headers: HEADERS,
        agent: false
      }, (response) => {
        // Stores the output from the request in chunks
        let data = []

        // Add the result to the output as we get it
        response.on('data', (chunk) => {
          data.push(chunk)
        })

        // Process the final data
        response.on('end', () => {
          let issues = JSON.parse(data.join('')).issues

          let trimmedIssues = []
          // Loop through all issues trimming issues to just the ID, name, and descr
          for (var i = 0; i < issues.length; i++) {
            var issue = issues[i]

            trimmedIssues.push({
              key: issue.key,
              name: issue.fields.summary,
              description: issue.fields.description
            })
          }

          // Resolve the promise with the trimmed issues
          resolve(trimmedIssues)
        })
      })

      request.on('error', (err) => reject(err))
    })

    return issuesPromise
  },

  getWorkLog: (dateWorked, project) => {
    let workLogPromise = new Promise((resolve, reject) => {
      // Uses JIRA's JQL language to get all open issues for the current user
      var path = ''

      if (project) {
        path = encodeURI('/rest/api/2/search?fields=summary,description,worklog&jql=assignee=currentuser() AND worklogDate=' + dateWorked + ' AND project=\'' + project + '\'')
      } else {
        path = encodeURI('/rest/api/2/search?fields=summary,description,worklog&jql=assignee=currentuser() AND worklogDate=' + dateWorked)
      }

      const request = https.get({
        hostname: 'jira.ctsi.ufl.edu',
        path: path,
        headers: HEADERS,
        agent: false
      }, (response) => {
        // Stores the output from the request in chunks
        let data = []

        // Add the result to the output as we get it
        response.on('data', (chunk) => {
          data.push(chunk)
        })

        // Process the final data
        response.on('end', () => {
          let issues = JSON.parse(data.join('')).issues
          let trimmedWorklog = []
          // Loop through all issues where there was work done on the date provided
          for (let i = 0; i < issues.length; i++) {
            var worklogs = issues[i].fields.worklog.worklogs

            // Loop through each worklog in the issue checking to make sure the date is correct
            for (let j = 0; j < worklogs.length; j++) {
              // The date from JIRA is formated with the time and offset but we only care about date
              if (worklogs[j].updated.startsWith(dateWorked)) {
                trimmedWorklog.push({
                  issueId: issues[i].key,
                  timeSpent: worklogs[j].timeSpent,
                  comment: worklogs[j].comment
                })
              }
            }
          }

          // Resolve the promise with the workLog
          resolve(trimmedWorklog)
        })
      })

      request.on('error', (err) => reject(err))
    })

    return workLogPromise
  },

  addNewWorklog: (issueId, timeSpent, comment, dateWorked) => {
    let newWorkLogPromise = new Promise((resolve, reject) => {
      const request = https.request({
        hostname: 'jira.ctsi.ufl.edu',
        path: '/rest/api/2/issue/' + issueId + '/worklog',
        headers: HEADERS,
        agent: false,
        method: 'POST'
      }, (response) => {
        // Stores the output from the request in chunks
        let data = []

        // If the code is in the 400s or 500s JIRA had a problem with our request
        if (response.statusCode >= 400) {
          reject(Error('Error returned with code: ' + response.statusCode))
        }

        // Add the result to the output as we get it
        response.on('data', (chunk) => {
          data.push(chunk)
        })

        // Called when everything finishes
        response.on('end', () => {
          resolve()
        })
      })

      request.on('error', (err) => reject(err))

      // Format the datetime correctly for JIRA
      if (!dateWorked) {
        dateWorked = moment().format('YYYY-MM-DDThh:mm:ss.SSSZZ')
      } else {
        dateWorked = moment(dateWorked).format('YYYY-MM-DDThh:mm:ss.SSSZZ')
      }

      let postData = JSON.stringify({
        'comment': comment,
        'timeSpent': timeSpent,
        'started': dateWorked
      })

      request.write(postData)
      request.end()
    })

    return newWorkLogPromise
  }

}
