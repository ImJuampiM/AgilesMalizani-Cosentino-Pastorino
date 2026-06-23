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
