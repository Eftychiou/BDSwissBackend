export interface IUser {
  isMissingProperties(): boolean;
  isValidated(): boolean;
  getEmail(): string;
  getPassword(): string | number;
  getFullName(): string;
}
