import { useState, useEffect, useRef } from "react";
import Note from "./components/Note";
import Toggleable from "./components/Toggleable";
import noteService from "./services/notes";
import LoginForm from "./components/LoginForm";
import NoteForm from "./components/NoteForm";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

const Footer = () => {
  const footerStyle = {
    color: "green",
    fontStyle: "italic",
    fontSize: 16,
  };

  return (
    <div style={footerStyle}>
      <br />
      <em>
        Note app, Department of Computer Science, University of Helsinki 2023
      </em>
    </div>
  );
};

const App = () => {
  const [notes, setNotes] = useState(null);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);
  const noteFormRef = useRef();

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  if (!notes) {
    return null;
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };
    // PUT replaces the resource in the given url
    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((n) => (n.id !== id ? n : returnedNote)));
      })
      .catch((error) => {
        setErrorMessage(
          `Note: '${note.content}' was already removed from the server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => {
        return note.important;
      });

  const createNote = (noteObject) => {
    noteFormRef.current.toggleVisibility();
    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
    });
  };

  const setCredentials = (user) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedNoteAppUser");
  };

  const loginForm = () => (
    <Toggleable buttonLabel="login">
      <LoginForm
        setErrorMessage={setErrorMessage}
        setCredentials={setCredentials}
      />
    </Toggleable>
  );

  const noteForm = () => (
    <Toggleable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm createNote={createNote} />
    </Toggleable>
  );

  return (
    <div>
      <h1>Notes app</h1>
      <Notification message={errorMessage} />
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button type="button" onClick={handleLogout}>
            logout
          </button>
          {noteForm()}
        </div>
      )}
      <div>
        <button
          onClick={() => {
            setShowAll(!showAll);
            console.log(user);
          }}
        >
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <Footer />
    </div>
  );
};

export default App;
