import { useState, useEffect } from "react";
import phonebookService from "./services/numbers";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newSearch, setNewSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const hook = () => {
    phonebookService
      .getAll()
      .then((initialPersons) => setPersons(initialPersons));
  };

  useEffect(hook, []);

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(newSearch.toLowerCase())
  );

  const addPerson = (event) => {
    const personObject = {
      name: newName,
      number: newNumber,
    };
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );

      const person = persons.find((p) => p.name === personObject.name);
      const updatedPerson = { ...person, number: personObject.number };

      phonebookService
        .update(updatedPerson)
        .then((returnedPerson) => {
          setPersons(
            persons.map((p) => (p.id !== person.id ? p : returnedPerson))
          );
          setIsError(false);
          setMessage(`Changed ${personObject.name}'s number`);
        })
        .catch((error) => {
          setIsError(true);
          setMessage(
            `Information of ${personObject.name} has already been removed from the server`
          );
          phonebookService
            .getAll()
            .then((initialPersons) => setPersons(initialPersons));
        });
    } else {
      phonebookService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setIsError(false);
        setMessage(`Added ${personObject.name}`);
      });
    }
    setTimeout(() => {
      setMessage(null);
    }, 5000);
    setNewName("");
    setNewNumber("");
  };

  const removePerson = (name, id) => {
    window.confirm(`Delete ${name}?`);
    phonebookService.remove(id).then((returnedPersons) => {
      setPersons(returnedPersons);
      setIsError(false);
      setMessage(`Deleted ${name} from the directory`);
    });
    setNewName("");
    setNewNumber("");
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} isError={isError} />
      <Filter newSearch={newSearch} handleSearchChange={handleSearchChange} />
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} removePerson={removePerson} />
    </div>
  );
};

export default App;
