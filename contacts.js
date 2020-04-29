const fs = require("fs");
const path = require("path");
const { promises: fsPromises } = fs;

const contactsPath = path.join(__dirname, "db", "contacts.json");

function getData() {
  return fsPromises
    .readFile(contactsPath, "utf-8")
    .then((data) => JSON.parse(data))
    .catch((err) => err);
}

function listContacts(req, res) {
  getData()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getContactById({ req, res, contactId }) {
  getData()
    .then((data) => {
      const contact = data.find((el) => el.id == contactId);
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
    .then((data) => {
      const contact = data.find((el) => el.id == contactId);
      if (!contact) {
        res.status(404).send({ message: "Not found" });
      }
      const filteredContacts = data.filter((el) => el.id != contactId);
      fsPromises
        .writeFile(contactsPath, JSON.stringify(filteredContacts, "", 2))
        .then(() => {
          res.status(200).send({ message: "contact deleted" });
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

//********* */

function addContact({ name, email, phone, req, res }) {
  getData().then((data) => {
    const contact = {
      id: Date.now,
      name,
      email,
      phone,
    };

    data.push(contact);

    fsPromises
      .writeFile(contactsPath, JSON.stringify(data, "", 2))
      .then(() => {
        res.status(201).send(contact);
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

function updateContact({ req, res, id }) {
  getData().then((data) => {
    const contact = data.findIndex((el) => el.id == id);
    if (contact == -1) {
      res.status(404).send({ message: "Not found" });
    } else {
      Object.assign(data[contact], { ...req.body });
      fsPromises.writeFile(contactsPath, JSON.stringify(contact)).then(() => {
        res.send(data[contact]);
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
