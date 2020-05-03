const fs = require("fs");
const path = require("path");
const { promises: fsPromises } = fs;
const contactsPath = path.join(__dirname, "db", "contacts.json");

const contacts = fs.readFileSync(contactsPath, "utf-8");
const contactsArray = JSON.parse(contacts);

function getData() {
  return fsPromises
    .readFile(contactsPath, "utf-8")
    .then((contacts) => JSON.parse(contacts))
    .catch((err) => err);
}

function listContacts(req, res) {
  getData()
    .then((contacts) => {
      res.send(contacts);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getContactById({ req, res, contactId }) {
  getData()
    .then((contacts) => {
      const contact = contacts.find((el) => el.id == contactId);
      if (contact) {
        res.send(contact);
      } else {
        res.status(404).send({ message: "Not found" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function removeContact({ res, contactId }) {
  getData()
    .then((contacts) => {
      const contact = contacts.find((el) => el.id == contactId);
      if (!contact) {
        res.status(404).send({ message: "Not found" });
      }
      const filteredContacts = contacts.filter((el) => el.id != contactId);
      fsPromises
        .writeFile(contactsPath, JSON.stringify(filteredContacts, "utf-8", 2))
        .then(() => {
          res.status(200).send({ message: "contact deleted" });
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

// ********* */

function addContact({ res, name, email, phone }) {
  getData().then((contacts) => {
    lastId = contactsArray.length + 1;
    let newContact = {
      id: lastId,
      name,
      email,
      phone,
    };

    contacts.push(newContact);
    console.log(contacts);
    fsPromises
      .writeFile(contactsPath, JSON.stringify(contacts, "utf-8", 2))
      .then(() => {
        res.status(201).send(newContact);
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

function updateContact({ req, res, id }) {
  getData().then((contacts) => {
    const contact = contacts.findIndex((el) => el.id == id);
    if (contact == -1) {
      res.status(404).send({ message: "Not found" });
    } else {
      Object.assign(contacts[contact], { ...req.body });
      fsPromises.writeFile(contactsPath, JSON.stringify(contact)).then(() => {
        res.send(contacts[contact]);
      });
    }
  });
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
