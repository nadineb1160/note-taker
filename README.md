# Note Taker
This is an application that can be used to write, save, and delete notes. This application uses an express backend and saves/retrieves note data from a JSON file.

![note taker demo](public/assets/demo/demo.gif)

## Technologies:
- Express
- Node
- JS

## How to Post a Note:
Create node with id and update local notes and database.
```
app.post("/api/notes", function (req, res) {

    var newNote = req.body;

    // Add ID - Timestamp
    newNote.id = uuidv1();

    localNotes.push(newNote);

    writeDB();

    res.json(newNote);
});
```

## How to Delete a Note:
Filter notes without chosen ID, update local and write to database.
```
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
```

### Installation:
- Run: npm install 

### Usage:
- Run: node server.js
- Open: localhost:3000 in browser


## Authors
Nadine Bundschuh

- Github: nadineb1160
- [GitHub](https://github.com/nadineb1160)
- [LinkedIn](https://www.linkedin.com/in/nadine-bundschuh-731233b9)

