import bcrypt from 'bcrypt';
import { CONFIGS } from '../config/config';
const salt = Number(CONFIGS.SALT_ROUND);

class Hasher {
  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}

export default new Hasher();
