const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


// Express App
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static Files
app.use(express.static("public"));



// HTML Routes
// Home Page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// View Notes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});


// API Routes
// Reads the json file
app.get("/api/notes", function(req, res) {
    readFileAsync("./db/db.json", "utf8").then(function(data) {
        data = JSON.parse(data);
        // console.log(data)
        return res.json(data);
    });
});
  
// Add new note
app.post("/api/notes", function(req, res) {
    const newNote = req.body;
    readFileAsync("./db/db.json", "utf8").then(function(data) { 
        data = JSON.parse(data);
        data.push(newNote);
        data[data.length - 1].id = data.length - 1;
        writeFileAsync("./db/db.json", JSON.stringify(data));
        res.json(data);
        console.log("Note succesfully created!");
    });
});

// Delete/Update
app.delete("/api/notes/:id", function(req, res) {
    const selectedNoteId = req.params.id;
    readFileAsync("./db/db.json", "utf8").then(function(data) {
        data = JSON.parse(data);
        data.splice(selectedNoteId, 1);
        for (var i = 0; i < data.length; i++) {
            data[i].id = i;
        }
        writeFileAsync("./db/db.json", JSON.stringify(data));
        res.json(data);
        console.log("Note succesfully removed!");
    });
});

// Starts Server
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });