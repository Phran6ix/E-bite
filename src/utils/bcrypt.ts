import * as bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 13);
}

export async function comparePassword(
  inputPassword: string,
  userPassword: string
) {
  return bcrypt.compare(inputPassword, userPassword);
}
