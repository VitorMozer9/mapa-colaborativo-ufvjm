export class Resultado<T> {
  private constructor(
    public readonly ehSucesso: boolean,
    public readonly erro?: string,
    private readonly _valor?: T
  ) {}

  get valor(): T {
    if (!this.ehSucesso) {
      throw new Error('Não é possível obter valor de resultado falho');
    }
    return this._valor as T;
  }

  // Factory method para sucesso
  static ok<U>(valor?: U): Resultado<U> {
    return new Resultado<U>(true, undefined, valor);
  }

  // Factory method para falha
  static falha<U>(erro: string): Resultado<U> {
    return new Resultado<U>(false, erro);
  }
}