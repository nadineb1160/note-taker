const express = require("express");
const path = require("path");
const fs = require("fs");
// Note ID - Timestamp(v1)
const { v1: uuidv1 } = require('uuid'); 

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// Initialize Local Notes - DB
var notes = [];


// **************************
// ****** Basic Routes ******
// **************************

/* index.html Route */
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});


/* notes.html Route */
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});


// **************************
// ******* API Routes *******
// **************************

// Display All Notes
app.get("/api/notes", function (req, res) {

    // Read notes from DB
    fs.readFile("db/db.json", function (err, result) {

        if (err) throw err;

        // All Notes from DB
        let dbResult = JSON.parse(result);

        // Update Notes with DB Results
        notes = dbResult;

        // Return the DB Results as JSON
        return res.json(dbResult);
    });
});


// Display One Note
app.get("/api/notes/:id", function (req, res) {

    // Chosen Note ID 
    var chosenNoteId = req.params.id;

    // Filter Notes with chosen ID
    let foundNoteWithID = notes.filter(note => chosenNoteId === note.id);

    // Returns Note Object with ID or [] if not found
    return res.json(foundNoteWithID);
    
});


// **************************
// ******* Create Note ******
// **************************

app.post("/api/notes", function (req, res) {

    // req.body equal to JSON post sent from the user
    var newNote = req.body;

    // Add New ID for Note - Timestamp
    newNote.id = uuidv1();

    // Add New Note to Local DB
    notes.push(newNote);

    // Write Updated Notes to DB
    writeDB();

    res.json(newNote);
});


// **************************
// ******* Delete Note ******
// **************************

app.delete("/api/notes/:id", function (req, res) {

    // Chosen Note ID 
    var chosenNoteId = req.params.id;

    // Map Notes without Chosen ID
    let newNotes = notes.filter(note => chosenNoteId !== note.id);

    // Update Notes with Note Removed
    notes = newNotes;

    // Write to DB
    fs.writeFile("db/db.json", JSON.stringify(notes), (err) => {

        if (err) throw err;
    
        // Complete write file
        res.json({okay: true}); // status 200 is default
    });
});


function writeDB() {
    fs.writeFile("db/db.json", JSON.stringify(notes), (err) => {
        if (err) throw err;
    });
}


// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});