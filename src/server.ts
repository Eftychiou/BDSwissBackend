import express from "express";

import User from "./models/User";
import { Messages } from "./interface/Messages";
import DatabaseDriver from "./models/DatabaseDriver";

const app = express();
const port = 4000;

const database = new DatabaseDriver()
  .setFilePath("database")
  .initializeDatabase();

app.use(express.json());

app.get("/", async (req, res) => {
  res.json(await database.getUsers());
});

app.post("/register", async (req, res) => {
  const { email, password, fullName } = req.body;
  const user = new User(email, password, fullName);
  if (user.isMissingProperties())
    return res.status(400).json({ message: Messages.BAD_REQUEST });
  if (!user.isValidated())
    return res.status(400).json({
      message: Messages.REGISTER_REQUIREMENTS,
    });
  const userAlreadyRegistered = await database.allreadyRegistered(user);
  if (userAlreadyRegistered)
    return res.status(400).json({ message: Messages.ALLREADY_REGISTERED });
  database.addUser(user);
  database.save();
  res.status(201).json({ message: Messages.REGISTER_COMPLETE });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  database
    .findUser(email)
    .then((user) => {
      if (!user)
        return res.status(400).json({ message: Messages.USER_NOT_REGISTERED });
      if (user.getPassword() !== password)
        return res.status(403).json({ message: Messages.NOT_AUTHENTICATED });
      res
        .status(201)
        .json({ email: user.getEmail(), fullName: user.getFullName() });
    })
    .catch((err) => console.log(err));
});

app.use((req, res) => {
  res.status(404).json({ message: Messages.ROUTE_NOT_FOUND });
});

app.use((error, _req, res, _next) => {
  console.log(error);
  res.status(500).json({ message: Messages.INTERNAL_ERROR });
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
