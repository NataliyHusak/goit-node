const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const dotenv = require("dotenv");
const contacts = require("./contacts");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

dotenv.config();

const PORT = process.env.PORT;
// const PORT = 3002;

app.get("/", (req, res) => {
  res.send("Hello from api");
});

app.get("/api/contacts", (req, res) => {
  contacts.listContacts(req, res);
});

app.get("/api/contacts/:contactId", (req, res) => {
  contacts.getContactById({ req, res, contactId: req.params.contactId });
});

app.delete("/api/contacts/:contactId", (req, res) => {
  const contactId = req.params.contactId;
  contacts.removeContact({ req, res, contactId });
});

//********* */
app.post(
  "/api/contacts",
  (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });
    const result = Joi.validate( req.body, schema);
    if (result.error) {
      res.status(400).send({ message: "missing required name field" });
    } else {
      next();
    }
  },
  (req, res) => {
    contacts.addContact({ ...req.body, res });
  }
);

app.patch(
  "/api/contacts/:contactId",
  (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });
    const result = Joi.validate(req.body, schema, res);
    if (result.error) {
      res.status(400).send({ message: "missing fields" });
    } else {
      next();
    }
  },
  (req, res) => {
    const id = req.params.contactId;
    contacts.updateContact({ req, res, id });
  }
);

app.listen(PORT, () => {
  console.log("App start on port:", PORT);
});
