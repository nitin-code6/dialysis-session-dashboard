const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/db");

// load env variables
dotenv.config();

// connect DB
connectDB();

const PORT = process.env.PORT || 5000;

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});