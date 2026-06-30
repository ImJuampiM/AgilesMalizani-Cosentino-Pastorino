import { Sesion } from "../domain/Sesion";
import { vidasDeNivel } from "../domain/niveles";
import { mountApp } from "./main";
import { mountSetup } from "./setup";

const PALABRAS = ["PERRO", "CABALLO", "ELEFANTE", "TIGRE", "LEON"];

const params = new URLSearchParams(window.location.search);
const wordParam = params.get("word");
const seedParam = params.get("seed");
const nivelParam = params.get("nivel");
const pistaParam = params.get("pista");
const modoParam = params.get("modo");

const vidas = vidasDeNivel(nivelParam ?? "normal");
const pista = pistaParam ?? "";

const root = document.getElementById("app");

function iniciar(palabras: string[], rng: () => number): void {
  if (root) {
    mountApp(root, new Sesion(palabras, rng, vidas, pista));
  }
}

if (modoParam === "duo" && wordParam === null) {
  // Modo dos jugadores: el jugador 1 ingresa la palabra antes de empezar.
  if (root) {
    mountSetup(root, (palabra) => iniciar([palabra], () => 0));
  }
} else if (wordParam !== null) {
  iniciar([wordParam], () => 0);
} else {
  const rng =
    seedParam !== null ? () => Number(seedParam) / PALABRAS.length : Math.random;
  iniciar(PALABRAS, rng);
}
