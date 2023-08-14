const express = require('express');
const path = require('path');
// const data = require('./db/db.json');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;
const uuid = require('./helpers/uuid')

const {readFromFile, readAndAppend, readAndRemove} = require('./helpers/fsUtils')
// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware to parse JSON
app.use(express.json());

// main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, ''));
});

// Connecting notes.html 
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//api for 
app.get('/api/notes', (req, res) => {
  // JSON in this is a buffer
  // extra parse into a array of notes 
  // and notes to an array 
  //JSON parse only for this project for htis matter
  readFromFile('./db/db.json').then(data =>{ 
    res.json(JSON.parse(data))})
})

// POST request to add a review
app.post('/api/notes', (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid()
    };

    readAndAppend(newNote, './db/db.json')

    // // Write the string to a file
    // fs.writeFile(`./db/db.json`, `${reviewString}`, (err) =>
    //   err
    //     ? console.error(err)
    //     : console.log(
    //         `YAY`
    //       )
    // );

    const response = {
      status: 'Post',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error');
  }
});

app.delete(`/api/notes/:id`, (req, res) => {
  // always needs params when using :id
  const noteId = req.params.id
  readAndRemove(noteId, "./db/db.json")
  res.json('YAY')
})

// wildcard always has to be at the bottom of list of routes 
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
