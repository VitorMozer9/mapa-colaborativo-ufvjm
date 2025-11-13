import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class PasswordHasher {
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static validate(password: string): { valid: boolean; message?: string } {
    if (password.length < 6) {
      return {
        valid: false,
        message: 'A senha deve ter no mínimo 6 caracteres'
      };
    }

    if (password.length > 100) {
      return {
        valid: false,
        message: 'A senha deve ter no máximo 100 caracteres'
      };
    }

    return { valid: true };
  }
}