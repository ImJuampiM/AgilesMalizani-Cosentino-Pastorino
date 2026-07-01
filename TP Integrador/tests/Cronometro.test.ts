import { it, expect } from "vitest";
import { Cronometro } from "../src/domain/Cronometro";

it("un cronómetro nuevo tiene todo el tiempo restante disponible", () => {
  const cronometro = new Cronometro(30, () => 1000);
  expect(cronometro.tiempoRestante()).toBe(30);
});
