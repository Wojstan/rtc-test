import express from 'express'
import { simulateEvents } from './integration/simulateEvents'
import { getEvents } from './store/eventStore'

const app = express()
const port = 4442

app.get('/client/state', (_req, res) => {
  const events = getEvents()
  res.json(events)
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})

setInterval(() => {
  simulateEvents()
}, 1000)
