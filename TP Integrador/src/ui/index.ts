import { Ahorcado } from "../domain/Ahorcado";
import { elegirPalabra } from "../domain/elegirPalabra";
import { mountApp } from "./main";

const PALABRAS = ["PERRO", "CABALLO", "ELEFANTE", "TIGRE", "LEON"];

const params = new URLSearchParams(window.location.search);
const wordParam = params.get("word");
const seedParam = params.get("seed");

let palabra: string;
if (wordParam !== null) {
  palabra = wordParam;
} else {
  const rng =
    seedParam !== null ? () => Number(seedParam) / PALABRAS.length : Math.random;
  palabra = elegirPalabra(PALABRAS, rng);
}

const root = document.getElementById("app");
if (root) {
  mountApp(root, new Ahorcado(palabra));
}
