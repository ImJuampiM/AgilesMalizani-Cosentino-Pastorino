import { it, expect } from "vitest";
import { vidasDeNivel } from "../src/domain/niveles";

it("el nivel dificil arranca con 4 vidas", () => {
  expect(vidasDeNivel("dificil")).toBe(4);
});
