import app from "./app";
import http from "http";
import { connectDatabase } from "./config/database.config";
import { ENV_CONFIG } from "./config/env.config";
//import { verify } from "crypto";
import { verifySmtp } from "./config/nodemailer.config";

const PORT = ENV_CONFIG.PORT;
const DB_URI = ENV_CONFIG.DB_URI;

//* connect database
connectDatabase(DB_URI);

//* http server
const server = http.createServer(app);

//* listen
server.listen(PORT, () => {
  verifySmtp();
  console.log(`server is running at http://localhost:${PORT}`);
});
