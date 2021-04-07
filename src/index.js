import '@babel/polyfill'

import express from 'express'
import { urlencoded, json } from 'body-parser'
import cors from 'cors'
import { createServer } from 'http'
import socketIO from 'socket.io'
import worker from './worker'
import setRouters from './routes'

const app = express()
app.use(cors())
app.use(urlencoded({ extended:true }))
app.use(json())
const serverHTTP = createServer(app)
const socket = socketIO(serverHTTP, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

worker(socket)
setRouters(app)
process.setMaxListeners(100)
serverHTTP.listen(8080, () => {
  console.log('server listen at 8080')
})