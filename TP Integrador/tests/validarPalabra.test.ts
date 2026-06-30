import { it, expect } from "vitest";
import { esPalabraValida } from "../src/domain/validarPalabra";

it("una palabra de solo letras es valida", () => {
  expect(esPalabraValida("SOL")).toBe(true);
});

it("una palabra vacia es invalida", () => {
  expect(esPalabraValida("")).toBe(false);
});

it("una palabra con numeros o simbolos es invalida", () => {
  expect(esPalabraValida("SOL1")).toBe(false);
});

it("una palabra con acentos o enie es valida", () => {
  expect(esPalabraValida("AÑO")).toBe(true);
  expect(esPalabraValida("LEÓN")).toBe(true);
});
