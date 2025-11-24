import bcrypt from 'bcrypt';
import { IServicoCriptografia, ResultadoValidacaoSenha } from '../../interfaces/services/ICryptographyService';

const SALT_ROUNDS = 10;

export class ServicoCriptografiaBcrypt implements IServicoCriptografia {
  async criptografar(senha: string): Promise<string> {
    return bcrypt.hash(senha, SALT_ROUNDS);
  }

  async comparar(senha: string, hash: string): Promise<boolean> {
    return bcrypt.compare(senha, hash);
  }

  validar(senha: string): ResultadoValidacaoSenha {
    if (senha.length < 6) {
      return {
        valido: false,
        mensagem: 'A senha deve ter no mínimo 6 caracteres',
      };
    }

    if (senha.length > 100) {
      return {
        valido: false,
        mensagem: 'A senha deve ter no máximo 100 caracteres',
      };
    }

    return { valido: true };
  }
}
