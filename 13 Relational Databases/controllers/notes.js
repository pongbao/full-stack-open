const router = require("express").Router();
const { Note, User } = require("../models");
const { tokenExtractor } = require("../util/middleware");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  // const notes = await sequelize.query("SELECT * FROM notes", {
  //   type: QueryTypes.SELECT,
  // });
  let important = {
    [Op.in]: [true, false],
  };

  if (req.query.important) {
    important = req.query.important === "true";
  }

  const notes = await Note.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where: {
      important,
      content: {
        [Op.substring]: req.query.search ? req.query.search : "",
      },
    },
  });
  // console.log(notes.map((n) => n.toJSON()));
  console.log(JSON.stringify(notes, null, 2));
  res.json(notes);
});

router.post("/", tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const note = await Note.create({
      ...req.body,
      userId: user.id,
      date: new Date(),
    });
    res.json(note);
  } catch (error) {
    return res.status(400).json({ error });
  }

  // const note = Note.build(req.body);
  // note.important = true;
  // await note.save();
});

const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id);
  next();
};

router.get("/:id", noteFinder, async (req, res) => {
  if (req.note) {
    // console.log(note.toJSON());
    res.json(req.note);
  } else {
    res.status(404).end();
  }
});

router.put("/:id", noteFinder, async (req, res) => {
  if (req.note) {
    req.note.important = req.body.important;
    await req.note.save();
    res.json(req.note);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", noteFinder, async (req, res) => {
  if (req.note) {
    await req.note.destroy();
  }
  res.status(204).end();
});

module.exports = router;
