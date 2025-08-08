import bcrypt from "bcryptjs"

export class CreateUserDto {
  username: string;
  password: string;
}