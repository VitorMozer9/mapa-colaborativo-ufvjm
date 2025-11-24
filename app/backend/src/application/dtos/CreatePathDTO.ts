export interface CriarCaminhoDTO {
  nome: string;
  coordenadas: Array<[number, number]>; // [longitude, latitude]
  ehAcessivel?: boolean;
}
