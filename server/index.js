const express = require("express");
const app = express();
const dotenv = require("dotenv");

const cors = require("cors");
const masterRouter = require("./routes/master.router");

//env
dotenv.config();

// Middleware's
app.use(cors({
 origin: ["https://neonflake-client.vercel.app"],
 methods :["POST","GET"],
 credentials: true
}));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

//checking for vercel
app.get("/", (req, res) => {
  res.send("Working");
});
// Routes
app.use("/api/v1", masterRouter);

// Start server
app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
