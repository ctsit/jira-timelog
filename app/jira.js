'use strict';

const https = require('https')

const HEADERS = {
  'Authorization': 'Basic ' + Buffer.from(process.env.JTL_USERNAME + ':' + process.env.JTL_PASS).toString('base64'),
  'Content-Type': 'application/json'
}

module.exports = {

  getUsersTasks: () => {
    // Uses JIRA's JQL language to get all open issues for the current user
    let get_issues_request = https.get({
      hostname: 'jira.ctsi.ufl.edu',
      path: encodeURI('/rest/api/2/search?jql=assignee=currentuser() AND (status!=DONE AND status !=CLOSED)'),
      headers: HEADERS,
      agent: false
    }, (response) => {
      let data = ''

      // Add the result to the output as we get it
      response.on('data', (chunk) => {
        data += chunk
      });

      // Process the final data
      response.on('end', () => {
        let issues = JSON.parse(data).issues

        // Loop through all issues printing the ID and the name
        for (var i = 0; i < issues.length; i++) {
          var issue = issues[i]

          console.log(issue.key + '    ' + issue.fields.summary)
        }
      })
    })
  }

}
