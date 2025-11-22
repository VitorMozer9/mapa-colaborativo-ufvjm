// src/application/AuthService.ts
import { IUserRepository } from '../interfaces/repositories/IUserRepository';
import { PasswordHasher } from '../infrastructure/security/password';
import { JwtService } from '../infrastructure/security/jwt';
import { User } from '../domain/User';
import { Role } from '../domain/Role';

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository // <- injected dependency
  ) {}

  async register(name: string, email: string, password: string, role: Role): Promise<{ user: User; token: string }> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error('User already exists');
    }

    const hashed = await PasswordHasher.hash(password);
    const user = User.create(name, email, hashed, role);
    const savedUser = await this.userRepository.create(user);

    const token = JwtService.generate({
      userId: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    });

    return { user: savedUser, token };
  }
}
