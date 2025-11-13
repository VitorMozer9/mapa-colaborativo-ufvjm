import { Role } from './Role';

export class User {
    
  constructor(
    public readonly id: string,           // ID único
    public readonly name: string,         // Nome completo
    public readonly email: string,        // Email
    public readonly password: string,     // Senha (hash)
    public readonly role: Role,           // Papel do usuário
    public readonly createdAt: Date,      // Data de criação
    public readonly updatedAt: Date       // Data de atualização
  ) {
  }

  static create(
    name: string,
    email: string,
    password: string,
    role: Role = Role.VISITOR  
  ): User {
    // Retorna um novo User
    return new User(
      crypto.randomUUID(),  
      name,
      email,
      password,
      role,
      new Date(),          // Data atual
      new Date()
    );
  }
  
  // Verifica se o usuário é admin
  isAdmin(): boolean {
    return this.role === Role.ADMIN;
  }

  // Verifica se pode gerenciar conteúdo
  canManageContent(): boolean {
    return this.role === Role.ADMIN || this.role === Role.TEACHER;
  }
}