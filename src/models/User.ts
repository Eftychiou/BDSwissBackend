import { IUser } from "../interface/IUser";

export default class User implements IUser {
  private email: string;
  private password: string | number;
  private fullName: string;
  constructor(email: string, password: string | number, fullName: string) {
    this.email = email;
    this.password = password;
    this.fullName = fullName;
  }
  setEmail(email) {
    this.email = email;
  }
  getEmail() {
    return this.email;
  }
  getFullName() {
    return this.fullName;
  }
  getPassword() {
    return this.password;
  }

  isMissingProperties() {
    if (!this.email || !this.password || !this.fullName) return true;
    else return false;
  }
  isValidated() {
    const passwordTrimmed = this.password.toString().trim();
    const passwordSize = passwordTrimmed.length;
    const containsNumber = /\d/.test(passwordTrimmed);
    const containsLetter = /[a-zA-Z]/.test(passwordTrimmed);
    const fullNameSize = this.fullName.trim().length;
    if (
      passwordSize >= 8 &&
      containsNumber &&
      containsLetter &&
      fullNameSize >= 5
    )
      return true;
    return false;
  }
}
//
