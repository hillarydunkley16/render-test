const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/note')
const dotenv = require('dotenv')
dotenv.config()
app.use(express.static('dist'))
let notes = [] 
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
  
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  app.use(cors())
  app.use(express.json())
  app.use(requestLogger)
  app.use(express.static('dist'))
  //get all notes
  app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes)
    })
  })

app.use(express.json())

//get a specific note 
app.get('/api/notes/:id', (request, response) =>{
    Note.findById(request.params.id).then(note => {
      response.json(note)
    })
  
})
//how to delete a note? 
app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})
//add a new note to the system
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})
app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 