import express from 'express'
import { processEvents } from './processing/processEvents'
import { getEvents } from './store/eventStore'

const app = express()
const port = 3005

app.get('/client/state', (_req, res) => {
  const events = getEvents()
  res.json(events)
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})

setInterval(() => {
  processEvents()
}, 1000)
