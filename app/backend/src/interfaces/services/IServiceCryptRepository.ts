export interface IServicoCriptografia {
  // Criptografa uma senha em bruto
  criptografar(senha: string): Promise<string>;

  // Compara uma senha em bruto com seu hash
  comparar(senha: string, hash: string): Promise<boolean>;

  // Valida força da senha
  validar(senha: string): { valido: boolean; mensagem?: string };
}