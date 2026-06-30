import { it, expect } from "vitest";
import { esPalabraValida } from "../src/domain/validarPalabra";

it("una palabra de solo letras es valida", () => {
  expect(esPalabraValida("SOL")).toBe(true);
});
