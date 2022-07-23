import { IUser } from "./IUser";
export interface IDatabaseDriver {
  initializeDatabase(): IDatabaseDriver;
  updateDriver(): void;
  save(): void;
  getUsers(): Promise<IUser[]>;
  addUser(user: IUser): void;
  setFilePath(databaseName: string): IDatabaseDriver;
  getFilePath(): string;
  allreadyRegistered(theUser: IUser): Promise<boolean>;
  findUser(email: string): Promise<IUser>;
}
