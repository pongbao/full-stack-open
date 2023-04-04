import { useState } from "react";
import PropTypes from "prop-types";

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState("");

  const addNote = (event) => {
    event.preventDefault();
    createNote({
      content: newNote,
      important: true,
      // important: Math.random() < 0.5,
      // id: notes.length + 1, ommitted because it's better to let the server generate ids for our resources
    });

    setNewNote("");
  };

  return (
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={(event) => {
            setNewNote(event.target.value);
          }}
        />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

NoteForm.propTypes = {
  createNote: PropTypes.func.isRequired,
};

export default NoteForm;
