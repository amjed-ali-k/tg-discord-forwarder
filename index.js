import { app } from "deta";
import main from "./src/index";
app.lib.cron(main);

export default app;
