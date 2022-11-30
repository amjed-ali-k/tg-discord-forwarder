const { app } = require("deta");
const main = require("./src/index");
// import main from "./src/index";

app.lib.cron(main);

module.exports = app;

// export default app;
