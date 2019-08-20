const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// Connect database
connectDB();

// init middleware
app.use(express.json({ extended: false }));

// Enable CORS
app.use(cors());

// routes
app.use("/api/sessions", require("./routes/api/sessions"));
app.use("/api/queries", require("./routes/api/queries"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

// // server static assets if in production
// if (process.env.NODE_ENV === "production") {

// set static folder
// app.use(express.static(path.join(__dirname, "public")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
// });

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
