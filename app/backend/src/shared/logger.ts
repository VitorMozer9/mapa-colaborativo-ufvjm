export class Logger {
  static info(mensagem: string, contexto?: any): void {
    console.log('[INFO]', mensagem, contexto || '');
  }

  static warn(mensagem: string, contexto?: any): void {
    console.warn('[WARN]', mensagem, contexto || '');
  }

  static error(mensagem: string, erro?: any): void {
    console.error('[ERROR]', mensagem, erro || '');
  }

  // Para compatibilidade com alguns usos (Logger.erro)
  static erro(mensagem: string, erro?: any): void {
    this.error(mensagem, erro);
  }
}
