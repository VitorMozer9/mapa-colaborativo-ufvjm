import { IRepositorioUsuario } from '../../interfaces/repositories/IUserRepository';
import { IServicoCriptografia } from '../../interfaces/services/ICryptographyService';
import { IServicoJWT } from '../../interfaces/services/IServiceJWT';
import { Usuario } from '../../domain/User';
import { Role } from '../../domain/Role';
import { ValidationError } from '../../shared/errors/ValidationError';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError';
import { validarEmailInstitucional } from '../../shared/validators';
import { validarSiape } from '../../shared/validators';

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
    papel: Role = Role.VISITANTE,
    siape?: string
  ): Promise<{ usuario: Usuario; token: string }> {

    // Valida email institucional
    const ehInstitucional = validarEmailInstitucional(email);
    if (!ehInstitucional) {
      throw new ValidationError('Email deve ser institucional (@ufvjm)');
    }
    let papelDefinido = Role.ESTUDANTE;
    if (siape) {
      const siapeValido = validarSiape(siape);
      if (!siapeValido) {
        throw new ValidationError('SIAPE inválido');
      }
      papelDefinido = Role.PROFESSOR;
    }
    // Valida se já existe usuário
    const usuarioExistente = await this.repositorioUsuario.buscarPorEmail(email);
    if (usuarioExistente) {
      throw new ValidationError('Email já cadastrado');
    }

    // Valida força da senha
    const validacaoSenha = this.servicoCriptografia.validar(senha);
    if (!validacaoSenha.valido) {
      throw new ValidationError(validacaoSenha.mensagem || 'Senha inválida');
    }

    // Cria usuário com senha criptografada
    const senhaHash = await this.servicoCriptografia.criptografar(senha);
    const usuario = Usuario.criar(nome, email, senhaHash, papelDefinido);

    // Persiste e gera token
    const usuarioSalvo = await this.repositorioUsuario.criar(usuario);
    const token = this.servicoJWT.gerar({
      usuarioId: usuarioSalvo.id,
      email: usuarioSalvo.email,
      papel: usuarioSalvo.papel,
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

    const senhaValida = await this.servicoCriptografia.comparar(
      senha,
      usuario.senhaHash
    );
    if (!senhaValida) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const token = this.servicoJWT.gerar({
      usuarioId: usuario.id,
      email: usuario.email,
      papel: usuario.papel,
    });

    return { usuario, token };
  }

  async validarToken(
  token: string
): Promise<{ usuarioId: string; email: string; papel: Role }> {
  try {
    const conteudo = this.servicoJWT.verificar(token); 
    
    return {
      usuarioId: conteudo.usuarioId,
      email: conteudo.email,
      papel: conteudo.papel,
    };
  } catch {
    throw new UnauthorizedError('Token inválido ou expirado');
  }
}
}
