export interface CriarEventoDTO {
  titulo: string;
  descricao: string;
  dataInicio: Date;
  dataFim: Date;
  local: string;
  idPOI?: string;
  urlImagem?: string;
  urlInscricao?: string;
}
