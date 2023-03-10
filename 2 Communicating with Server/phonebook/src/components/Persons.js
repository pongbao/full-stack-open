const Persons = ({ personsToShow, removePerson }) => {
  return personsToShow.map((person) => (
    <form
      key={person.id}
      onSubmit={(event) => {
        event.preventDefault();
        removePerson(person.name, person.id);
      }}
    >
      {person.name} {person.number} <button type="submit">delete</button>
    </form>
  ));
};

export default Persons;
