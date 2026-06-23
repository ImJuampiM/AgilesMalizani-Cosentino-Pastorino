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

it("acertar una letra no descuenta vidas", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("A");
  expect(juego.vidasRestantes()).toBe(6);
});

it("fallar una letra descuenta una vida", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("E");
  expect(juego.vidasRestantes()).toBe(5);
});

it("la partida esta ganada cuando se adivinan todas las letras", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("G");
  juego.adivinar("A");
  juego.adivinar("T");
  juego.adivinar("O");
  expect(juego.estaGanada()).toBe(true);
});

it("la partida esta perdida cuando se agotan las vidas", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("B");
  juego.adivinar("C");
  juego.adivinar("D");
  juego.adivinar("F");
  juego.adivinar("H");
  juego.adivinar("J");
  expect(juego.estaPerdida()).toBe(true);
});

it("palabraRevelada muestra la palabra completa con espacios", () => {
  const juego = new Ahorcado("GATO");
  expect(juego.palabraRevelada()).toBe("G A T O");
});
