const express = require('express');

const { notes } = require('./data/notes.json');

const PORT = process.env.PORT || 3000;
const app = express();

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.listen(PORT, () => {
    console.log(`API server is now on port ${PORT}`);
});