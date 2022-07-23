"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("./models/User"));
const DatabaseDriver_1 = __importDefault(require("./models/DatabaseDriver"));
const app = (0, express_1.default)();
const port = 4000;
const database = new DatabaseDriver_1.default()
    .setFilePath("database")
    .initializeDatabase();
app.use(express_1.default.json());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield database.getUsers());
}));
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, fullName } = req.body;
    const user = new User_1.default(email, password, fullName);
    if (user.isMissingProperties())
        return res.status(400).json({ message: "Missing Credentials" });
    if (!user.isValidated())
        return res.status(400).json({
            message: "Password needs to be minimum 8 characters, contained at least 1 letter and 1 number and full name minimum 5 characters long",
        });
    const userAlreadyRegistered = yield database.allreadyRegistered(user);
    if (userAlreadyRegistered)
        return res.status(400).json({ message: "This user is already registered" });
    database.addUser(user);
    database.save();
    res.status(201).json({ message: "Register Complete" });
}));
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    database
        .findUser(email)
        .then((user) => {
        if (!user)
            return res.status(400).json({ message: "This email doesn't exist" });
        res
            .status(201)
            .json({ email: user.getEmail(), fullName: user.getFullName() });
    })
        .catch((err) => console.log(err));
});
app.use((req, res) => {
    res.status(404).json({ message: "Could not find this route" });
});
app.use((error, _req, res, _next) => {
    console.log(error);
    res.status(500).json({ message: "Something Went Wrong" });
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map