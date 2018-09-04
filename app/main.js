'use strict';

const program = require('commander')
const pkg = require('../package.json')
const actions = require('./actions.js')

program
  .version(pkg.version)
  .description(pkg.description)

program
  .command('list')
  .description('Print current tasks assigned.')
  .action(actions.printCurrentTask)

program
  .command('log <taskId> <time> [message]')
  .description('Log hours worked for a specific task with an optional message.')
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
