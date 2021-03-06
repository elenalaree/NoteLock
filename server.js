const express = require('express');
const fs = require('fs');

const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();
const {v4: uuidv4 } = require('uuid');

const { notes } = require('./data/notes.json');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
//connect public
app.use(express.static('public'));



function createNewNote(body, notes) {
    const note = body;
    notes.push(note);
    fs.writeFileSync(
        path.join(__dirname, './data/notes.json'),
        JSON.stringify({notes}, null, 2)
      );
    return note;
}

//get notes and show results
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
        res.json(result);
        console.log(result);
        console.info(`${req.method} request received for notes`)
    } else {
        res.send(404);
    }
});


app.post('/api/notes', (req, res) => {
    // req.body is where our incoming content will be

    req.body.id = uuidv4();

    const note = createNewNote(req.body, notes)
    res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
    notes.forEach((note, i) => {
        if (note.id === req.params.id){
            notes.splice(i, 1);
            console.log(notes);
        }
    });
    fs.writeFile('./data/notes.json', JSON.stringify({notes}), (err) => {
        if (err) throw err;
    });
    res.send(notes);
});

//connecting html pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
//get html notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
app.listen(PORT, () => {
    console.log(`API server is now on port ${PORT}`);
});

