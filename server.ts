require("dotenv").config();
import { app } from "./app";
import http from "http";
import connectDatabase from "./utils/Database";
const server = http.createServer(app);

//create server
server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
  connectDatabase();
});
