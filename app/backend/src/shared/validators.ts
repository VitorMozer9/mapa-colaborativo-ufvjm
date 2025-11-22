export class Validadores {
  // Valida se é um email válido
  static ehEmailValido(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Valida se é um UUID válido
  static ehUUIDValido(uuid: string): boolean {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  }

  // Valida se string não está vazia
  static ehTextoValido(texto: string, tamanhoMinimo: number = 1): boolean {
    return texto.trim().length >= tamanhoMinimo;
  }

  // Valida se é uma URL válida
  static ehURLValida(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Valida se coordenadas estão dentro de limites geográficos válidos
  static ehCoordenadaValida(latitude: number, longitude: number): boolean {
    return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  }
}