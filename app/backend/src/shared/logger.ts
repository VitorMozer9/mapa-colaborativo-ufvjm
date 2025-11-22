export class Logger {
  // Log informativo
  static info(mensagem: string, ...args: any[]): void {
    console.log(`[INFO] ${this.obterTimestamp()} - ${mensagem}`, ...args);
  }

  // Log de erro
  static erro(mensagem: string, erro?: Error): void {
    console.error(`[ERRO] ${this.obterTimestamp()} - ${mensagem}`, erro);
  }

  // Log de aviso
  static aviso(mensagem: string, ...args: any[]): void {
    console.warn(`[AVISO] ${this.obterTimestamp()} - ${mensagem}`, ...args);
  }

  // Log de debug (apenas em desenvolvimento)
  static debug(mensagem: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${this.obterTimestamp()} - ${mensagem}`, ...args);
    }
  }

  // Retorna timestamp no formato ISO
  private static obterTimestamp(): string {
    return new Date().toISOString();
  }
}