const notesRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// notesRouter.get("/", (request, response) => {
//   Note.find({}).then((notes) => {
//     response.json(notes);
//   });
// });

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(notes);
});

notesRouter.get("/:id", async (request, response, next) => {
  const note = await Note.findById(request.params.id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }

  // Note.findById(request.params.id)
  //   .then((note) => {
  //     if (note) {
  //       response.json(note);
  //     } else {
  //       response.status(404).end();
  //     }
  //   })
  //   .catch((error) => next(error));
});

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

notesRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "invalid token" });
  }

  const user = await User.findById(decodedToken.id);

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user.id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  response.status(201).json(savedNote);

  // note
  //   .save()
  //   .then((savedNote) => {
  //     response.status(201).json(savedNote);
  //   })
  //   .catch((error) => next(error));
  // try {
  //   const savedNote = await note.save();
  //   response.status(201).json(savedNote);
  // } catch (exception) {
  //   next(exception);
  // }
});

notesRouter.delete("/:id", async (request, response, next) => {
  await Note.findByIdAndRemove(request.params.id);
  response.status(204).end();

  // Note.findByIdAndRemove(request.params.id)
  //   .then(() => {
  //     response.status(204).end();
  //   })
  //   .catch((error) => next(error));
  // try {
  //   await Note.findByIdAndRemove(request.params.id);
  //   response.status(204).end();
  // } catch (exception) {
  //   next(exception);
  // }
});

notesRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
