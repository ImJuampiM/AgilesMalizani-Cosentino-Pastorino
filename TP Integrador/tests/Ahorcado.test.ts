import { describe, it, expect } from "vitest";
import { Ahorcado } from "../src/domain/Ahorcado";

it("una partida nueva muestra la palabra enmascarada con guiones", () => {
  const juego = new Ahorcado("GATO");
  expect(juego.palabraEnmascarada()).toBe("_ _ _ _");
});

it("una partida nueva empieza con 6 vidas", () => {
  const juego = new Ahorcado("GATO");
  expect(juego.vidasRestantes()).toBe(6);
});

it("adivinar una letra presente revela todas sus ocurrencias", () => {
  const juego = new Ahorcado("ALA");
  juego.adivinar("A");
  expect(juego.palabraEnmascarada()).toBe("A _ A");
});

it("adivinar es case-insensitive", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("a");
  expect(juego.palabraEnmascarada()).toBe("_ A _ _");
});
