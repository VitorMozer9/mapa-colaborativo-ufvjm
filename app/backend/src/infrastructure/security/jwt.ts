// src/infrastructure/security/JWTService.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import { variaveisAmbiente } from '../database/variables';
import { ConteudoToken, IServicoJWT } from '../../interfaces/services/IServiceJWT';
import { UnauthorizedError } from '../../shared/errors';

export class ServicoJWT implements IServicoJWT {
  private obterSegredo(): jwt.Secret {
    return variaveisAmbiente.jwt.segredo as jwt.Secret;
  }

  gerar(payload: ConteudoToken): string {
    const opcoes: SignOptions = {
      expiresIn: variaveisAmbiente.jwt.tempoExpiracao as SignOptions['expiresIn'],
    };

    return jwt.sign(payload, this.obterSegredo(), opcoes);
  }

  verificar<T = ConteudoToken>(token: string): T {
    try {
      const decodificado = jwt.verify(token, this.obterSegredo()) as T;
      return decodificado;
    } catch (erro) {
      if (erro instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expirado');
      }
      if (erro instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Token inválido');
      }
      throw new UnauthorizedError('Erro ao validar token');
    }
  }

  decodificar<T = ConteudoToken>(token: string): T | null {
    try {
      return jwt.decode(token) as T;
    } catch {
      return null;
    }
  }
}
