import { it, expect } from "vitest";
import { Sesion } from "../src/domain/Sesion";

it("una sesion nueva tiene una partida en curso con la palabra enmascarada y 6 vidas", () => {
  const sesion = new Sesion(["GATO"], () => 0);
  expect(sesion.partidaActual().palabraEnmascarada()).toBe("_ _ _ _");
  expect(sesion.partidaActual().vidasRestantes()).toBe(6);
});

it("nuevaPartida reemplaza la partida en curso por una en limpio", () => {
  const sesion = new Sesion(["GATO"], () => 0);
  sesion.partidaActual().adivinar("G");
  sesion.nuevaPartida();
  expect(sesion.partidaActual().palabraEnmascarada()).toBe("_ _ _ _");
  expect(sesion.partidaActual().vidasRestantes()).toBe(6);
});

it("una sesion nueva tiene el marcador en cero", () => {
  const sesion = new Sesion(["GATO"], () => 0);
  expect(sesion.ganadas()).toBe(0);
  expect(sesion.perdidas()).toBe(0);
});
