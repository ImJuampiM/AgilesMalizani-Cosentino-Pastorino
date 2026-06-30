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

it("adivinar una letra ya intentada no descuenta vidas adicionales", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("E");
  juego.adivinar("E");
  expect(juego.vidasRestantes()).toBe(5);
});

it("adivinar una letra ya intentada devuelve repetida", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("E");
  expect(juego.adivinar("E")).toBe("repetida");
});

it("adivinar un caracter que no es una letra no descuenta vidas", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("3");
  expect(juego.vidasRestantes()).toBe(6);
});

it("adivinar con la partida ya perdida no se procesa", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("B");
  juego.adivinar("C");
  juego.adivinar("D");
  juego.adivinar("F");
  juego.adivinar("H");
  juego.adivinar("J");
  expect(juego.estaPerdida()).toBe(true);

  juego.adivinar("G");
  juego.adivinar("A");
  juego.adivinar("T");
  juego.adivinar("O");

  expect(juego.estaGanada()).toBe(false);
});

it("partesVisibles devuelve un array vacio con 0 errores", () => {
  const juego = new Ahorcado("GATO");
  expect(juego.partesVisibles()).toEqual([]);
});

it("partesVisibles devuelve cabeza con 1 error", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("B");
  expect(juego.partesVisibles()).toEqual(["cabeza"]);
});

it("partesVisibles devuelve las 6 partes con 6 errores", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("B");
  juego.adivinar("C");
  juego.adivinar("D");
  juego.adivinar("F");
  juego.adivinar("H");
  juego.adivinar("J");
  expect(juego.partesVisibles()).toEqual([
    "cabeza",
    "cuerpo",
    "brazo izquierdo",
    "brazo derecho",
    "pierna izquierda",
    "pierna derecha",
  ]);
});

it("una partida nueva no tiene letras usadas", () => {
  const juego = new Ahorcado("GATO");
  expect(juego.letrasUsadas()).toEqual([]);
});

it("adivinar una letra la agrega a las letras usadas", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("A");
  expect(juego.letrasUsadas()).toEqual(["A"]);
});

it("las letras usadas incluyen aciertos y fallos en orden de intento", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("A");
  juego.adivinar("E");
  expect(juego.letrasUsadas()).toEqual(["A", "E"]);
});


