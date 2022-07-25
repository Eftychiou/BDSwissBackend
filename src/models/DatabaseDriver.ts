import fs, { promises } from "fs";
import path from "path";

import { IDatabaseDriver } from "../interface/IDatabaseDriver";
import { IUser } from "../interface/IUser";
import User from "./User";

export default class DatabaseDriver implements IDatabaseDriver {
  private filePath: string;
  private data: { userList: IUser[] };

  initializeDatabase() {
    const dataToSave: { userList: IUser[] } = { userList: [] };
    const dataToSaveStr = JSON.stringify(dataToSave);
    promises
      .access(this.filePath)
      .catch((err) => promises.writeFile(this.filePath, dataToSaveStr))
      .finally(() => this.updateDriver());
    return this;
  }

  save() {
    fs.writeFile(this.filePath, JSON.stringify(this.data), (err) => {
      if (err) return console.log(err);
    });
  }

  async updateDriver() {
    try {
      const data: Buffer = await promises.readFile(this.filePath);
      const { userList } = JSON.parse(data.toString());
      const userListMapped: IUser[] = userList.map(
        (user) => new User(user.email, user.password, user.fullName)
      );
      this.data = { userList: userListMapped };
    } catch (err) {
      console.log(err);
    }
  }

  async allreadyRegistered(user) {
    await this.updateDriver();
    const userList = await this.getUsers();
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].getEmail().toString() === user.getEmail().toString()) {
        return Promise.resolve(true);
      }
    }
    return Promise.resolve(false);
  }
  async findUser(email) {
    const userList = await this.getUsers();
    const [user] = userList.filter(
      (user) => user.getEmail() === email.toString()
    );
    return Promise.resolve(user);
  }

  getFilePath() {
    return this.filePath;
  }

  setFilePath(databaseName) {
    const databasePath: string = path.join(
      process.cwd(),
      `${databaseName}.json`
    );
    this.filePath = databasePath;
    return this;
  }

  async getUsers() {
    await this.updateDriver();
    return Promise.resolve(this.data.userList);
  }

  addUser(user) {
    this.data.userList.push(user);
  }
}
