export interface DatosMarcador {
  ganadas: number;
  perdidas: number;
  racha: number;
}

export interface Almacen {
  cargar(): DatosMarcador | null;
  guardar(datos: DatosMarcador): void;
}
