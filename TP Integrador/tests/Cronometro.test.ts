import { it, expect } from "vitest";
import { Cronometro } from "../src/domain/Cronometro";

it("un cronómetro nuevo tiene todo el tiempo restante disponible", () => {
  const cronometro = new Cronometro(30, () => 1000);
  expect(cronometro.tiempoRestante()).toBe(30);
});

it("el tiempo restante baja según los segundos transcurridos", () => {
  let ahora = 1000;
  const cronometro = new Cronometro(30, () => ahora);
  ahora = 6000; // pasaron 5 segundos desde que arrancó
  expect(cronometro.tiempoRestante()).toBe(25);
});

it("el tiempo restante no baja de cero cuando se pasa del límite", () => {
  let ahora = 1000;
  const cronometro = new Cronometro(30, () => ahora);
  ahora = 41000; // pasaron 40 segundos, más que el límite de 30
  expect(cronometro.tiempoRestante()).toBe(0);
});
