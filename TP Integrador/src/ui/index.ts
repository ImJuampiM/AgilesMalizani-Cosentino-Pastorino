import { Sesion } from "../domain/Sesion";
import { mountApp } from "./main";

const PALABRAS = ["PERRO", "CABALLO", "ELEFANTE", "TIGRE", "LEON"];

const params = new URLSearchParams(window.location.search);
const wordParam = params.get("word");
const seedParam = params.get("seed");

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

const root = document.getElementById("app");
if (root) {
  mountApp(root, new Sesion(palabras, rng));
}
