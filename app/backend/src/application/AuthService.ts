import { IRepositorioUsuario } from '../interfaces/repositories/IUserRepository';
import { IServicoCriptografia } from '../interfaces/services/IServiceCryptRepository';
import { IServicoJWT } from '../interfaces/services/IServiceJWT';
import { Usuario } from '../domain/User';
import { Role } from '../domain/Role';
import { ValidationError } from '../shared/errors';
import { UnauthorizedError } from '../shared/errors';

export class ServicoAutenticacao {
  constructor(
    private readonly repositorioUsuario: IRepositorioUsuario,
    private readonly servicoCriptografia: IServicoCriptografia,
    private readonly servicoJWT: IServicoJWT
  ) {}

  // Registra um novo usuário no sistema
  async registrar(
    nome: string,
    email: string,
    senha: string,
    papel: Role = Role.VISITANTE
  ): Promise<{ usuario: Usuario; token: string }> {
    // Valida dados de entrada
    const usuarioExistente = await this.repositorioUsuario.buscarPorEmail(email);
    if (usuarioExistente) {
      throw new ValidationError('Email já cadastrado');
    }

    const validacaoSenha = this.servicoCriptografia.validar(senha);
    if (!validacaoSenha.valido) {
      throw new ValidationError(validacaoSenha.mensagem || 'Senha inválida');
    }

    // Cria usuário com senha criptografada
    const senhaHash = await this.servicoCriptografia.criptografar(senha);
    const usuario = Usuario.criar(nome, email, senhaHash, papel);

    // Persiste e gera token
    const usuarioSalvo = await this.repositorioUsuario.criar(usuario);
    const token = this.servicoJWT.gerar({
      usuarioId: usuarioSalvo.id,
      email: usuarioSalvo.email,
      papel: usuarioSalvo.papel
    });

    return { usuario: usuarioSalvo, token };
  }

  // Autentica usuário com email e senha
  async autenticar(
    email: string,
    senha: string
  ): Promise<{ usuario: Usuario; token: string }> {
    const usuario = await this.repositorioUsuario.buscarPorEmail(email);
    if (!usuario) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const senhaValida = await this.servicoCriptografia.comparar(senha, usuario.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const token = this.servicoJWT.gerar({
      usuarioId: usuario.id,
      email: usuario.email,
      papel: usuario.papel
    });

    return { usuario, token };
  }

  // Valida um token JWT
  async validarToken(token: string): Promise<{ usuarioId: string; email: string; papel: Role }> {
    try {
      return this.servicoJWT.verificar(token);
    } catch {
      throw new UnauthorizedError('Token inválido ou expirado');
    }
  }
}