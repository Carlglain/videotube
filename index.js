import { app } from "./src/app.js";
import "dotenv/config";
import connectDB from "./src/db/index.js";

const port = process.env.PORT || 2000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Mongodb connection error", error);
  });
