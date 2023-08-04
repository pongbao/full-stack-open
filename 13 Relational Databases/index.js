const express = require("express");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

app.use(express.json());

app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();

// const main = async () => {
//   try {
//     await sequelize.authenticate();
//     const notes = await sequelize.query("SELECT * FROM notes", {
//       type: QueryTypes.SELECT,
//     });
//     console.log(notes);
//     sequelize.close();
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };

// main();
