import bcrypt from 'bcryptjs';

async function hashPassword(
  password: string,
  salt: string | number,
): Promise<string> {
  return bcrypt.hash(password, salt);
}

async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export { hashPassword, comparePassword };
