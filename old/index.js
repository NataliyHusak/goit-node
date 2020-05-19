const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");
const Joi = require("joi");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const url = process.env.dbUrl;

const dbName = "db-contacts";

let db;

function validateContact(req, res, next) {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });

  const result = Joi.validate(req.body, schema);

  if (result.error) return res.status(400).send(result.error);

  next();
}

app.get("/", (req, res) => {
  res.send("hello from API");
});

app.get("/contacts", (req, res) => {
  db.collection("contacts")
    .find()
    .toArray((err, docs) => {
      if (err) return res.sendStatus(500);

      res.send(docs);
    });
});

app.post("/contacts", validateContact, (req, res) => {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  db.collection("contacts").insertOne(contact, (err) => {
    if (err) return res.sendStatus(500);

    res.status(200).json(contact);
  });
});

app.get("/contacts/:id", (req, res) => {
  db.collection("contacts").findOne(
    { _id: ObjectID(req.params.id) },
    (err, docs) => {
      if (err) return res.sendStatus(500);

      res.status(200).json(docs);
    }
  );
});

app.put("/contacts/:id", validateContact, (req, res) => {
  db.collection("contacts").updateOne(
    { _id: ObjectID(req.params.id) },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      },
    },
    (err, docs) => {
      if (err) return res.sendStatus(500);
      res.status(200).send("was upd");
    }
  );
});

app.delete("/contacts/:id", (req, res) => {
  db.collection("contacts").deleteOne(
    { _id: ObjectID(req.params.id) },
    (err, result) => {
      if (err) return res.sendStatus(500);
      res.status(200).send("was del");
    }
  );
});

MongoClient.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, databaseConect) => {
    if (err) return console.log(err);

    console.log("Connected successfully to BD");

    db = databaseConect.db(dbName);

    app.listen(process.env.PORT, () => {
      console.log("app is runnin on port " + process.env.PORT);
    });
  }
);
