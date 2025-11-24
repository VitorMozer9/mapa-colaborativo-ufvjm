export interface ResultadoValidacaoSenha {
  valido: boolean;
  mensagem?: string;
}

export interface IServicoCriptografia {
  criptografar(senha: string): Promise<string>;
  comparar(senha: string, hash: string): Promise<boolean>;
  validar(senha: string): ResultadoValidacaoSenha;
}
