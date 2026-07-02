import { Almacen, DatosMarcador } from "../domain/Almacen";

export class AlmacenLocalStorage implements Almacen {
  private readonly clave = "ahorcado_marcador";

  cargar(): DatosMarcador | null {
    const raw = localStorage.getItem(this.clave);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (
        typeof parsed.ganadas === "number" &&
        typeof parsed.perdidas === "number" &&
        typeof parsed.racha === "number"
      ) {
        return parsed as DatosMarcador;
      }
    } catch {
      // Ignorar errores de parseo
    }
    return null;
  }

  guardar(datos: DatosMarcador): void {
    localStorage.setItem(this.clave, JSON.stringify(datos));
  }
}
