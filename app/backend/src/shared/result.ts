export type Resultado<T> =
  | { sucesso: true; valor: T }
  | { sucesso: false; erro: Error };

export function sucesso<T>(valor: T): Resultado<T> {
  return { sucesso: true, valor };
}

export function falha<T = never>(erro: Error): Resultado<T> {
  return { sucesso: false, erro };
}
