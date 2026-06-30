import { Sesion } from "../domain/Sesion";
import { vidasDeNivel } from "../domain/niveles";
import { mountApp } from "./main";

const PALABRAS = ["PERRO", "CABALLO", "ELEFANTE", "TIGRE", "LEON"];

const params = new URLSearchParams(window.location.search);
const wordParam = params.get("word");
const seedParam = params.get("seed");
const nivelParam = params.get("nivel");

let palabras: string[];
let rng: () => number;
if (wordParam !== null) {
  palabras = [wordParam];
  rng = () => 0;
} else {
  palabras = PALABRAS;
  rng =
    seedParam !== null ? () => Number(seedParam) / PALABRAS.length : Math.random;
}

const vidas = vidasDeNivel(nivelParam ?? "normal");

const root = document.getElementById("app");
if (root) {
  mountApp(root, new Sesion(palabras, rng, vidas));
}
