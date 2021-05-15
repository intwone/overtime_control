const express = require('express')
const cors = require('cors')
const generateID = require('../util/generateID')

const app = express()

app.use(express.json())
app.use(cors())

const overtimeHours = []

app.get('/overtimes_hours', (request, response) => {
  return response.json(overtimeHours)
})

app.get('/filter_overtimes_hours', (request, response) => {
  const { day } = request.body

  const results = overtimeHours.filter(overtime => {
    return overtime.day === day
  })

  return response.json(results)
})

app.post('/overtime_hour', (request, response) => {
  const { day, initialHour, finalHour } = request.body

  const overtime = {
    id: generateID(),
    day,
    initialHour,
    finalHour
  }

  overtimeHours.push(overtime)

  return response.json(overtime)
})

app.put('/alter_overtime/:id', (request, response) => {
  const { id } = request.params
  const { day, initialHour, finalHour } = request.body

  const overtimeIndex = overtimeHours.findIndex(element => String(element.id) === id)

  if (overtimeIndex === -1) {
    return response.status(400).json({ error: 'This id does not exist.' })
  }

  const overtimeChanged = {
    id: Number(id),
    day,
    initialHour,
    finalHour
  }

  overtimeHours[overtimeIndex] = overtimeChanged

  return response.json(overtimeChanged)
})

app.delete('/delete_overtime/:id', (request, response) => {
  const { id } = request.params

  const overtimeIndex = overtimeHours.findIndex(element => String(element.id) === id)

  if (overtimeIndex === -1) {
    return response.status(400).json({ error: 'This id does not exist.' })
  }

  const deletedOvertime = overtimeHours.splice(overtimeIndex, 1)

  return response.json(deletedOvertime)
})

module.exports = app