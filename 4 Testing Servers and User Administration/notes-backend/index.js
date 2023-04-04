const app = require("./app");
const config = require("./utils/config");

if (process.env.NODE_ENV === "test") {
  console.log("Running in test mode");
}

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
