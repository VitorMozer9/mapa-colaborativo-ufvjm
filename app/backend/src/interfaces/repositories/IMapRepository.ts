export interface IRepositorioMapa {
  obterMapaCompletoGeoJSON(): Promise<any>;
  
  obterLimitesMapa(): Promise<{
    bounds: [[number, number], [number, number]];
  }>;
}