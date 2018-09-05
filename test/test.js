#!/usr/bin/env node
const expect = require('chai').expect
const CliTest = require('command-line-test')

/* global describe:true */
/* global it:true */
/* eslint no-undef: "error" */

describe('Environment variable test', () => {
  it('should print error if no both variables are not set', async () => {
    const cliTest = new CliTest()
    delete process.env.JTL_USERNAME
    delete process.env.JTL_PASS
    const result = await cliTest.exec('./jtl.js')
    expect(result.stdout).to.be.equal('Please supply your Jira username and password in the JTL_USERNAME and JTL_PASS environment variables.')
  })

  it('should print error if only JTL_USERNAME is set', async () => {
    const cliTest = new CliTest()
    delete process.env.JTL_PASS
    process.env.JTL_USERNAME = 'super.secret'
    const result = await cliTest.exec('./jtl.js')
    expect(result.stdout).to.be.equal('Please supply your Jira username and password in the JTL_USERNAME and JTL_PASS environment variables.')
  })

  it('should print error if only JTL_PASS is set', async () => {
    const cliTest = new CliTest()
    delete process.env.JTL_USERNAME
    process.env.JTL_PASS = 'super.secret'
    const result = await cliTest.exec('./jtl.js')
    expect(result.stdout).to.be.equal('Please supply your Jira username and password in the JTL_USERNAME and JTL_PASS environment variables.')
  })
})

describe('log command', () => {
  it('should error if no args are passed', async () => {
    const cliTest = new CliTest()
    process.env.JTL_USERNAME = 'super.secret'
    process.env.JTL_PASS = 'super.secret'
    const result = await cliTest.exec('./jtl.js log')
    expect('' + result.error).to.contain('\n  error: missing required argument `issueId\'\n')
  })

  it('should error if only issueId is passed', async () => {
    const cliTest = new CliTest()
    process.env.JTL_USERNAME = 'super.secret'
    process.env.JTL_PASS = 'super.secret'
    const result = await cliTest.exec('./jtl.js log INT-1234567')
    expect('' + result.error).to.contain('\n  error: missing required argument `time\'\n')
  })

  it('should error if text is passsed as a date', async () => {
    const cliTest = new CliTest()
    process.env.JTL_USERNAME = 'super.secret'
    process.env.JTL_PASS = 'super.secret'
    const result = await cliTest.exec('./jtl.js log --date=tomorrow INT-1234567 1h')
    expect(result.stdout).to.be.equal('Please use a correct date in the form of YYYY-MM-DD')
  })

  it('should error if impossible date is passsed', async () => {
    const cliTest = new CliTest()
    process.env.JTL_USERNAME = 'super.secret'
    process.env.JTL_PASS = 'super.secret'
    const result = await cliTest.exec('./jtl.js log --date=2018-09-40 INT-1234567 1h')
    expect(result.stdout).to.be.equal('Please use a correct date in the form of YYYY-MM-DD')
  })
})

describe('logs command', () => {
  it('should error if no args are passed', async () => {
    const cliTest = new CliTest()
    process.env.JTL_USERNAME = 'super.secret'
    process.env.JTL_PASS = 'super.secret'
    const result = await cliTest.exec('./jtl.js logs')
    expect('' + result.error).to.contain('\n  error: missing required argument `date\'\n')
  })

  it('should error if text is passsed as a date', async () => {
    const cliTest = new CliTest()
    process.env.JTL_USERNAME = 'super.secret'
    process.env.JTL_PASS = 'super.secret'
    const result = await cliTest.exec('./jtl.js logs today')
    expect(result.stdout).to.be.equal('Please use a correct date in the form of YYYY-MM-DD')
  })

  it('should error if impossible date is passsed', async () => {
    const cliTest = new CliTest()
    process.env.JTL_USERNAME = 'super.secret'
    process.env.JTL_PASS = 'super.secret'
    const result = await cliTest.exec('./jtl.js logs 2018-09-40')
    expect(result.stdout).to.be.equal('Please use a correct date in the form of YYYY-MM-DD')
  })

  it('should error if no project is passed with --project flag', async () => {
    const cliTest = new CliTest()
    process.env.JTL_USERNAME = 'super.secret'
    process.env.JTL_PASS = 'super.secret'
    const result = await cliTest.exec('./jtl.js logs --project 2018-09-40')
    expect('' + result.error).to.contain('\n  error: missing required argument `date\'\n')
  })

  it('should error if no project is passed with -p flag', async () => {
    const cliTest = new CliTest()
    process.env.JTL_USERNAME = 'super.secret'
    process.env.JTL_PASS = 'super.secret'
    const result = await cliTest.exec('./jtl.js logs --project 2018-09-40')
    expect('' + result.error).to.contain('\n  error: missing required argument `date\'\n')
  })
})

describe('logs command', () => {
  it('should error if no args are passed', async () => {
    const cliTest = new CliTest()
    process.env.JTL_USERNAME = 'super.secret'
    process.env.JTL_PASS = 'super.secret'
    const result = await cliTest.exec('./jtl.js rm')
    expect('' + result.error).to.contain('\n  error: missing required argument `issueId\'\n')
  })

  it('should error if only issueId is passed', async () => {
    const cliTest = new CliTest()
    process.env.JTL_USERNAME = 'super.secret'
    process.env.JTL_PASS = 'super.secret'
    const result = await cliTest.exec('./jtl.js rm INT-123456')
    expect('' + result.error).to.contain('\n  error: missing required argument `worklogId\'\n')
  })
})
