import { it, expect } from "vitest";
import { elegirPalabra } from "../src/domain/elegirPalabra";

it("elegirPalabra con un rng que devuelve 0 elige la primera palabra de la lista", () => {
  const lista = ["PERRO", "CABALLO", "ELEFANTE"];
  expect(elegirPalabra(lista, () => 0)).toBe("PERRO");
});

it("elegirPalabra con un rng cercano a 1 elige la última palabra de la lista", () => {
  const lista = ["PERRO", "CABALLO", "ELEFANTE"];
  expect(elegirPalabra(lista, () => 0.99)).toBe("ELEFANTE");
});
