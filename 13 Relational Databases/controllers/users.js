const router = require("express").Router();

const { User, Note, Team } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.get("/", async (req, res) => {
  var users;

  if (Object.keys(req.query).length > 0) {
    if (req.query.admin) {
      if (req.query.search) {
        users = await User.scope("admin", {
          method: ["name", `%${req.query.search}%`],
        }).findAll();
      } else {
        users = await User.scope("admin").findAll();
      }
    } else if (req.query.disabled) {
      users = await User.scope("disabled").findAll();
    } else if (req.query.search) {
      users = await User.scope({
        method: ["name", `%${req.query.search}%`],
      }).findAll();
    } else if (!isNaN(Number(req.query.minnotes))) {
      users = await User.with_notes(req.query.minnotes);
    } else {
      res.redirect("/api/users");
    }
  } else {
    users = await User.findAll({
      include: [
        {
          model: Note,
          attributes: { exclude: ["userId"] },
        },
        {
          model: Note,
          as: "marked_notes",
          attributes: { exclude: ["userId"] },
          through: {
            attributes: [],
          },
          include: {
            model: User,
            attributes: ["name"],
          },
        },
        {
          model: Team,
          attributes: ["name", "id"],
          through: {
            attributes: [],
          },
        },
      ],
    });
  }

  res.json(users);
});

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [""] },
    include: [
      {
        model: Note,
        attributes: { exclude: ["userId"] },
      },
      {
        model: Note,
        as: "marked_notes",
        attributes: { exclude: ["userId"] },
        through: {
          attributes: [],
        },
        include: {
          model: User,
          attributes: ["name"],
        },
      },
    ],
  });

  if (!user) {
    return res.status(404).end();
  }

  let teams = undefined;
  if (req.query.teams) {
    teams = await user.getTeams({
      attributes: ["name"],
      joinTableAttributes: [],
    });
  }
  res.json({
    ...user.toJSON(),
    number_of_notes: await user.number_of_notes(),
    teams,
  });
});

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);
  if (!user.admin) {
    return res.status(401).json({ error: "operation not allowed" });
  }
  next();
};

router.put("/:username", tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });

  if (user) {
    user.disabled = req.body.disabled;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
