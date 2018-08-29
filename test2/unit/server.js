/* eslint-disable no-console */

/*

# test server

serves data from ./cases/rpc.js

*/

let {config, cases} = require('./fixtures')
let {rpc} = cases
let {jsonRpc, ws} = config
let express = require('express')
let bodyParser = require('body-parser')
let WebsocketServer = require('ws').Server
let each = require('lodash/each')

let wss = new WebsocketServer({
  host: ws.host,
  port: ws.port,
  clientTracking: false
})

// http server
let hs = express()

// node http server for `.close()`
let nhs

hs.disable('etag').disable('x-powered-by')

function shutdown() {
  try {
    wss.close()
    nhs.close()
  } catch (e) {
    console.error('error shutting down', e)
    return process.exit(1)
  }
  process.exit(0)
}

function getExpectedRpcResponse(body) {
  let {method, id} = body
  let res = {id}

  if (id === undefined || id === null) {
    res.id = null
  }

  // find the method if it exists
  each(rpc, item => {
    if (item.call !== undefined && item.call === method) {
      res.result = item.expected
    }
  })

  if (res.result !== undefined) {
    return res
  }

  // otherwise send back an error
  res.error = {
    id,
    code: 10,
    message: 'method not found',
    body
  }

  return res
}

hs.post('*', bodyParser.json(), ({body}, res) => {
  let rpcRes = getExpectedRpcResponse(body)
  res.json(rpcRes)
})

nhs = hs.listen(config.jsonRpc.port, config.jsonRpc.host, err => {
  if (err !== null && err !== undefined) {
    console.error('error listening http server', config.jsonRpc, err)
    shutdown()
    return
  }

  console.log(`json rpc test server ${jsonRpc.url}`)
})

wss.on('error', err => {
  console.error('websocket server error', err)
})

wss.on('connection', socket => {
  socket.on('message', req => {
    let body = JSON.parse(req)
    // console.log('ws body', body)
    let rpcRes = getExpectedRpcResponse(body)
    // console.log('rpcRes', rpcRes)
    socket.send(JSON.stringify(rpcRes))
  })
})

process.on('SIGINT', shutdown)

process.on('unhandledException', err => {
  console.error('unhandledException', err)
  shutdown()
})

if (process.env.STOP_SERVER === '1') {
  setTimeout(() => process.exit(), 5000)
}
