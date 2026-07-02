import { esPalabraValida } from "../domain/validarPalabra";
import "./styles.css";

// Pantalla previa del modo dos jugadores: el jugador 1 ingresa la palabra.
// Si es válida, invoca onEmpezar con la palabra en mayúsculas; si no, avisa.
export function mountSetup(
  root: HTMLElement,
  onEmpezar: (palabra: string, pista: string) => void,
): void {
  function render(mensaje = ""): void {
    root.innerHTML = `
      <div class="ahorcado">
        <header class="barra"><h1>Ahorcado</h1></header>
        <div class="tablero setup">
          <p>Jugador 1: ingresá la palabra a adivinar</p>
          <input type="text" data-testid="setup-word" placeholder="Una palabra" />
          <input type="text" data-testid="setup-hint" placeholder="Pista (opcional)" style="text-transform: none;" />
          <button data-testid="start">Empezar</button>
          ${mensaje ? `<div data-testid="message">${mensaje}</div>` : ""}
        </div>
      </div>
    `;
    const inputPalabra = root.querySelector<HTMLInputElement>('[data-testid="setup-word"]')!;
    const inputPista = root.querySelector<HTMLInputElement>('[data-testid="setup-hint"]')!;
    const boton = root.querySelector<HTMLButtonElement>('[data-testid="start"]')!;
    boton.addEventListener("click", () => {
      const palabra = inputPalabra.value.trim().toUpperCase();
      const pista = inputPista.value.trim();
      if (esPalabraValida(palabra)) {
        onEmpezar(palabra, pista);
      } else {
        render("Palabra invalida");
      }
    });
  }

  render();
}
