import express from "express";
import "dotenv/config";
import logger from "./src/utils/logger.js";
import morgan from "morgan";
const app = express();
const morganFormat = ":method :url :status :response-time ms";
const port = process.env.PORT || 2000;
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
