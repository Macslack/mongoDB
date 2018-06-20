const express = require('express');
const parser = require('body-parser');
const server = express();

server.use(parser.json());
server.use(parser.urlencoded({extended: true}));

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

MongoClient.connect("mongodb://localhost:27017", function(err, client){
  if (err) {
    console.log(err);
  }
  const db = client.db("philosophy_quotes");
  console.log("Connected to DB!!");

  server.post("/api/quotes", function(req, res, next){
    const quotesCollection = db.collection("quotes");
    const quoteToSave = req.body;
    quotesCollection.save(quoteToSave, function(err, result){
      if(err) next(err)
      res.status(201);
      res.json(result.ops[0])
      console.log("saved to DB!!");
    })
  })

  server.get("/api/quotes", function(req, res, next){
    const quotesCollection = db.collection("quotes");
    quotesCollection.find().toArray(function(err, allQuotes){
      if (err) next(err);
      res.json(allQuotes);
    })
  })

  server.delete("/api/quotes", function(req, res, next){
    const quotesCollection = db.collection("quotes");
    quotesCollection.remove({}, function(err, result){
      if (err) next(err);
      res.status(200).send
    })
  })

  server.post("/api/quotes/:id", function(req, res, next){
    const quotesCollection = db.collection("quotes");
    const objectID = ObjectID(req.params.id);
    quotesCollection.update({_id: objectID}, req.body, function(err, result){
      if (err) next(err);
      res.status(200).send();
    })
  })
});

server.listen(3000, function(){
  console.log("Listening on port 3000");
});
