import { it, expect } from "vitest";
import { Sesion } from "../src/domain/Sesion";
import { DatosMarcador } from "../src/domain/Almacen";

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

it("una sesion creada con una cantidad de vidas arranca la partida con esas vidas", () => {
  const sesion = new Sesion(["GATO"], () => 0, 4);
  expect(sesion.partidaActual().vidasRestantes()).toBe(4);
});

it("una sesion creada con una pista se la pasa a la partida en curso", () => {
  const sesion = new Sesion(["GATO"], () => 0, 6, "Animal domestico");
  expect(sesion.partidaActual().pista()).toBe("Animal domestico");
});

it("una sesion nueva tiene el marcador en cero", () => {
  const sesion = new Sesion(["GATO"], () => 0);
  expect(sesion.ganadas()).toBe(0);
  expect(sesion.perdidas()).toBe(0);
});

it("ganar una partida y empezar otra suma una ganada al marcador", () => {
  const sesion = new Sesion(["SOL"], () => 0);
  sesion.partidaActual().adivinar("S");
  sesion.partidaActual().adivinar("O");
  sesion.partidaActual().adivinar("L");
  sesion.nuevaPartida();
  expect(sesion.ganadas()).toBe(1);
  expect(sesion.perdidas()).toBe(0);
});

it("perder una partida y empezar otra suma una perdida al marcador", () => {
  const sesion = new Sesion(["SOL"], () => 0);
  for (const letra of ["B", "C", "D", "F", "G", "H"]) {
    sesion.partidaActual().adivinar(letra);
  }
  sesion.nuevaPartida();
  expect(sesion.perdidas()).toBe(1);
  expect(sesion.ganadas()).toBe(0);
});

it("una sesion nueva tiene racha en cero", () => {
  const sesion = new Sesion(["GATO"], () => 0);
  expect(sesion.rachaActual()).toBe(0);
});

it("ganar una partida y empezar otra sube la racha a 1", () => {
  const sesion = new Sesion(["SOL"], () => 0);
  sesion.partidaActual().adivinar("S");
  sesion.partidaActual().adivinar("O");
  sesion.partidaActual().adivinar("L");
  sesion.nuevaPartida();
  expect(sesion.rachaActual()).toBe(1);
});

it("ganar dos partidas seguidas y empezar otra sube la racha a 2", () => {
  const sesion = new Sesion(["SOL"], () => 0);
  sesion.partidaActual().adivinar("S");
  sesion.partidaActual().adivinar("O");
  sesion.partidaActual().adivinar("L");
  sesion.nuevaPartida();
  sesion.partidaActual().adivinar("S");
  sesion.partidaActual().adivinar("O");
  sesion.partidaActual().adivinar("L");
  sesion.nuevaPartida();
  expect(sesion.rachaActual()).toBe(2);
});

it("perder una partida despues de ganar resetea la racha a cero", () => {
  const sesion = new Sesion(["SOL"], () => 0);
  sesion.partidaActual().adivinar("S");
  sesion.partidaActual().adivinar("O");
  sesion.partidaActual().adivinar("L");
  sesion.nuevaPartida(); // Racha = 1
  for (const letra of ["B", "C", "D", "F", "G", "H"]) {
    sesion.partidaActual().adivinar(letra);
  }
  sesion.nuevaPartida();
  expect(sesion.rachaActual()).toBe(0);
});

it("una sesion nueva carga el marcador del almacen", () => {
  const almacenFake = {
    cargar: () => ({ ganadas: 5, perdidas: 2, racha: 3 }),
    guardar: () => {},
  };
  const sesion = new Sesion(["GATO"], () => 0, 6, "", almacenFake);
  expect(sesion.ganadas()).toBe(5);
  expect(sesion.perdidas()).toBe(2);
  expect(sesion.rachaActual()).toBe(3);
});

it("nuevaPartida guarda el marcador actualizado en el almacen", () => {
  let guardado: DatosMarcador | null = null;
  const almacenFake = {
    cargar: () => null,
    guardar: (datos: DatosMarcador) => { guardado = datos; },
  };
  const sesion = new Sesion(["GATO"], () => 0, 6, "", almacenFake);
  sesion.partidaActual().adivinar("G");
  sesion.partidaActual().adivinar("A");
  sesion.partidaActual().adivinar("T");
  sesion.partidaActual().adivinar("O");
  sesion.nuevaPartida();
  
  expect(guardado).toEqual({ ganadas: 1, perdidas: 0, racha: 1 });
});
