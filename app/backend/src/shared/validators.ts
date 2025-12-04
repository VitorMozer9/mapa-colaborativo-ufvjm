// src/shared/validators.ts

export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validarUUID(id: string): boolean {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(id);
}

export function validarStringNaoVazia(valor: string, minimo = 1): boolean {
  return valor !== undefined && valor !== null && valor.trim().length >= minimo;
}

export function validarEmailInstitucional(email: string): boolean {
  const regex = /^[a-zA-Z0-9._+-]+@(discente\.)?ufvjm\.edu\.br$/;
  return regex.test(email);
}

export function validarSiape(siape: string): boolean {
  const regex = /^[0-9]{5,10}$/;
  return regex.test(siape);
}
