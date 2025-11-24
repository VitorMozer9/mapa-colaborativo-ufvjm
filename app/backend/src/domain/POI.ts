import { Coordenadas  } from './Coordinate';

export enum CategoriaPOI {
  ACADEMICO = 'academico',
  ADMINISTRATIVO = 'administrativo',
  RESTAURANTE = 'restaurante',
  BIBLIOTECA = 'biblioteca',
  LABORATORIO = 'laboratorio',
  AUDITORIO = 'auditorio',
  ESPORTES = 'esportes',
  ESTACIONAMENTO = 'estacionamento',
  ENTRADA = 'entrada',
  BANHEIRO = 'banheiro',
  ACESSIBILIDADE = 'acessibilidade',
  OUTRO = 'outro'
}

export class POI {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly descricao: string,
    public readonly categoria: CategoriaPOI,
    public readonly coordenadas: Coordenadas,
    public readonly nomePredio: string,
    public readonly andar?: string,
    public readonly numeroSala?: string,
    public readonly urlImagem?: string,
    public readonly ehAcessivel: boolean = false,
    public readonly criadoEm: Date = new Date(),
    public readonly atualizadoEm: Date = new Date()
  ) {}

  static criar(
    nome: string,
    descricao: string,
    categoria: CategoriaPOI,
    coordenadas: Coordenadas,
    nomePredio: string,
    opcoes?: {
      andar?: string;
      numeroSala?: string;
      urlImagem?: string;
      ehAcessivel?: boolean;
    }
  ): POI {
    return new POI(
      crypto.randomUUID(),
      nome,
      descricao,
      categoria,
      coordenadas,
      nomePredio,
      opcoes?.andar,
      opcoes?.numeroSala,
      opcoes?.urlImagem,
      opcoes?.ehAcessivel ?? false
    );
  }
}