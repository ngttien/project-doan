require("dotenv").config();
const express = require("express");

const cors = require("cors");
const route = require("./src/routes");
const session = require("express-session");
//const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true },
  })
);
route(app);

app.listen(port, () => {
  console.log(`chạy thành công server tại http:localhost:${port}`);
});
