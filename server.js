const express = require("express");
const path = require("path");
const fs = require("fs");
const { v1: uuidv1 } = require('uuid'); 

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

var localNotes = [];


// **************************
// ****** Basic Routes ******
// **************************

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});


// **************************
// ******* API Routes *******
// **************************

app.get("/api/notes", function (req, res) {

    fs.readFile("db/db.json", function (err, result) {

        if (err) throw err;

        let dbResult = JSON.parse(result);

        localNotes = dbResult;

        return res.json(dbResult);
    });
});

app.get("/api/notes/:id", function (req, res) {

    var chosenNoteId = req.params.id;

    let foundNoteWithID = localNotes.filter(note => chosenNoteId === note.id);

    return res.json(foundNoteWithID);
});


// **************************
// ******* Create Note ******
// **************************

app.post("/api/notes", function (req, res) {

    var newNote = req.body;

    // Add ID - Timestamp
    newNote.id = uuidv1();

    localNotes.push(newNote);

    writeDB();

    res.json(newNote);
});


// **************************
// ******* Delete Note ******
// **************************

app.delete("/api/notes/:id", function (req, res) {

    var chosenNoteId = req.params.id;

    let notesWithoutID = localNotes.filter(note => chosenNoteId !== note.id);

    localNotes = notesWithoutID;

    fs.writeFile("db/db.json", JSON.stringify(localNotes), (err) => {

        if (err) throw err;
    
        // Complete write file
        res.json({okay: true});
    });
});


function writeDB() {
    fs.writeFile("db/db.json", JSON.stringify(localNotes), (err) => {
        if (err) throw err;
    });
}


// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});