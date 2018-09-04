'use strict';

module.exports = {

  printCurrentTask: (options) => {
    console.log(options)
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
