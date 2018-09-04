'use strict';

const program = require('commander')
const pkg = require('../package.json')
const actions = require('./actions.js')

program
  .version(pkg.version)
  .description(pkg.description)

program
  .command('list')
  .description('Print current issues assigned to you.')
  .action(actions.printCurrentIssue)

program
  .command('log <issueId> <time> [message]')
  .description('Log hours worked for a specific issue with an optional message.')
  .option('-D, --date <date>', 'Log a specific date instead of today.')
  .action(actions.logWork)

program
  .command('logs <date>')
  .description('Print all times worked for a specific date.')
  .option('-p, --project <project>', 'Filter by project')
  .action(actions.getLoggedWork)

if (!process.env.JTL_USERNAME || !process.env.JTL_PASS) {
  console.log('Please supply your Jira username and password in the JTL_USERNAME and JTL_PASS environment variables.')
  process.exit();
}

program.parse(process.argv)
