const fs = require("fs");
const path = require("path");

const contactsPath = path.join(__dirname, "db", "contacts.json");

// TODO: задокументировать каждую функцию

function listContacts() {
  fs.readFile(contactsPath, (error, data) => {
    if (error) {
      throw error;
    }
    console.table(JSON.parse(data));
  });
}

function getContactById(contactId) {
  fs.readFile(contactsPath, (error, data) => {
    if (error) {
      throw error;
    }
    const found = JSON.parse(data).find((el) => el.id === contactId);
    console.log(found);
  });
}

function removeContact(contactId) {
  fs.readFile(contactsPath, (err, contacts) => {
    if (err) {
      console.log(err);
      return;
    }

    const contactsList = JSON.parse(contacts);

    const filtredContacts = contactsList.filter(
      (contact) => contact.id !== contactId
    );

    fs.writeFile(contactsPath, JSON.stringify(filtredContacts), (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Contacts removed");
    });
  });
}

function addContact(name, email, phone) {
  fs.readFile(contactsPath, (err, contacts) => {
    if (err) {
      console.log(err);
      return;
    }
    const arr = JSON.parse(contacts);
    const latsItem = arr[arr.length - 1];

    const contact = {
      id: latsItem.id + 1,
      name,
      email,
      phone,
    };

    arr.push(contact);
    fs.writeFile(contactsPath, JSON.stringify(arr), (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Contacts Added");
    });
  });
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
