// dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

// generate random ids
// const uuid = require("uuid/v4");

// Set up the Express app
const app = express();
var PORT = process.env.PORT || 3000;

// Body parser for data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ========== ROUTES ==========

// Homepage route
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

// Notes route
app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname + "/public/notes.html"))
})

// API routes
// (GET) API Notes route
app.get("/api/notes", function(req, res){
    // read the db.json file
    fs.readFile("./db/db.json", "utf8", function(err, data){
        if(err){
            console.log(err);
        }
            // parse the data and store to variable
            let noteData = JSON.parse(data);

            // respond to user with the json data
            res.json(noteData);
    });
});

// (POST) API Notes route
app.post("/api/notes", function(req, res){
    // read the db.json file
    fs.readFile("./db/db.json", "utf8", function(err, data){
        if(err){
            console.log(err);
        }
            // parse the data and store to variable
            let noteData = JSON.parse(data);

            // give random id to note when it's saved
            // req.body.id = uuid();

            // store the newNote from the POST request to a new variable
            let newNote = req.body;
            console.log(newNote);

            // push the newNote into noteData (it's an array)
            noteData.push(newNote); 

            // write file
            fs.writeFile("./db/db.json", JSON.stringify(noteData), function(err){
                if(err){
                    return console.log(err);
                }
                    console.log("success!");
            })

            // respond to the user with the new note
            res.json(noteData);
    });
});

// (DELETE) API Notes Route
app.delete("/api/notes/:id", function(req, res){
    // Get the :id from the front end
    let urlid = req.params.id;

    // read the json file
    fs.readFile("./db/db.json", "utf8", function(err, data){
        if(err){
            console.log(err);
        }
            // if no error obtained, run code below

            // parse the current notes data
            const currentNotes = JSON.parse(data);

            // loop through the currentNotes array and find the matching id
            for(let i = 0; i < currentNotes.length; i++){

                // if the currentNotes id equals the front end id
                if(currentNotes[i].id === urlid){
                    // getting the index of an object inside an array:  
                    // https://stackoverflow.com/questions/15997879/get-the-index-of-the-object-inside-an-array-matching-a-condition
                    let index = currentNotes.findIndex(x => x.id === urlid);

                    // remove the object with the matching id
                    currentNotes.splice(index, 1);

                    // rewrite json file with the updated notes
                    fs.writeFile("./db/db.json", JSON.stringify(currentNotes), function(err){
                        if(err){
                            return console.log(err);
                        }
                            console.log("success!");
                    });

                    // respond to the user with the new notes
                    res.json(currentNotes);

                    console.log(currentNotes);
                } 
            }
    });
});

// ============================

// Start server for listening
app.listen(PORT, function(){
    console.log("App listening on PORT " + PORT);
});

