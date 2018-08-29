/*

common data used across tests

*/

let path = require('path')
let projectPath = path.join(__dirname, '..', '..')
let ipcSocketPath = path.join(projectPath, '.sockets', 'test-ipc-socket')
let cases = require('./cases')
let HttpProvider = require('../../src/http-provider')

// locally listening test server
let config = {
  jsonRpc: {
    host: '127.0.0.1',
    port: 11832,
    url: 'http://127.0.0.1:11832'
  },
  ws: {
    host: '127.0.0.1',
    port: 11833,
    url: 'ws://127.0.0.1:11833'
  },
  ipc: {
    socket: ipcSocketPath
  }
}

let testProvider = new HttpProvider(config.jsonRpc.url)

module.exports = {
  cases,
  config,
  testProvider
}
