import bcrypt from 'bcryptjs';

export async function hashPassword(
  password: string,
  salt: string | number,
): Promise<string> {
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
