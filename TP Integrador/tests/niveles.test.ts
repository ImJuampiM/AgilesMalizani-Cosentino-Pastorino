import { it, expect } from "vitest";
import { vidasDeNivel } from "../src/domain/niveles";

it("el nivel dificil arranca con 4 vidas", () => {
  expect(vidasDeNivel("dificil")).toBe(4);
});

it("el nivel facil arranca con 8 vidas", () => {
  expect(vidasDeNivel("facil")).toBe(8);
});

it("un nivel desconocido cae en las 6 vidas del nivel normal", () => {
  expect(vidasDeNivel("imposible")).toBe(6);
});
