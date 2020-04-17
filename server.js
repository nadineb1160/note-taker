const express = require("express");
const path = require("path");
const fs = require("fs");

var app = express();
var PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

var notes = [];

// Route that sends the user to index.html
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Route that sends the user to notes.html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Displays all notes
app.get("/api/notes", function (req, res) {
    // Read notes from DB
    fs.readFile("db/db.json", function (err, result) {
        if (err) throw err;
        // All Notes from DB
        let dbResult = JSON.parse(result);
        // Update Notes with DB Results
        notes = dbResult;

        // Return the DB Results ad JSON
        return res.json(dbResult);
    });
});

// Displays One Note - Used to get data when note is clicked
app.get("/api/notes/:id", function (req, res) {
    // Chosen Note ID 
    var chosenNoteId = parseInt(req.params.id);

    // Filter Notes with chosen ID
    let foundNoteWithID = notes.filter(note => chosenNoteId === parseInt(note.id));

    console.log(foundNoteWithID);

    // Returns note object with ID or [] if not found
    return res.json(foundNoteWithID);


});

// Create New Note - takes in JSON input
app.post("/api/notes/new", function (req, res) {
    // req.body equal to JSON post sent from the user
    var newNote = req.body;

    console.log(notes);

    // Add new id for note
    newNote.id = notes.length + 1;

    console.log("New Note: ", newNote);

    notes.push(newNote);

    console.log("Notes", notes);

    // Write Updated Notes to DB
    writeDB();

    return res.json(newNote);
});

// Delete Note with Unique ID
app.delete("/api/notes/:id", function (req, res) {
    // Chosen Note ID 
    var chosenNoteId = parseInt(req.params.id);

    console.log(chosenNoteId);

    // Map Notes without chosen ID
    let newNotes = notes.filter(note => chosenNoteId === parseInt(note.id));

    console.log(newNotes);
    // Remove Note
    

    // Write Updated Notes to DB
    writeDB();


});

function writeDB() {
    fs.writeFile("db/db.json", JSON.stringify(notes), (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
    });
}

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

