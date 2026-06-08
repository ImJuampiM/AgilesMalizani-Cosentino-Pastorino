# Ciclo TDD

**Red → Green → Refactor**

1. **Red**: escribir un test que falla
2. **Green**: escribir el código mínimo para que el test pase
3. **Refactor**: mejorar el código sin romper los tests

---

# String Calculator Kata

## Metodología

- Pensar los Tests que van a codear
- Codear un Test a la vez
- Cuando se termina un Test lo suben al repositorio
- Cambian de Programador
- Siguen por otro Test
- Cuando están todos los Tests listos para una funcionalidad avisar para seguir con la siguiente

---

## Tests — String Calculator

| # | Descripción | Input | Expected |
|---|-------------|-------|----------|
| 1 | String vacío devuelve 0 | `Add("")` | `0` |
| 2 | Un número devuelve ese número | `Add("1")` | `1` |
| 3 | Dos números separados por coma | `Add("1,2")` | `3` |
| 4 | Múltiples números | `Add("1,2,3")` | `6` |
| 5 | Salto de línea como separador | `Add("1\n2")` | `3` |
| 6 | Mezcla de coma y salto de línea | `Add("1\n2,3")` | `6` |


| 7 | Un negativo solo lanza excepción | `Add("-1")` | Exception: `"negatives not allowed: -1"` |
| 8 | Negativo entre positivos lanza excepción | `Add("1,-2,3")` | Exception: `"negatives not allowed: -2"` |
| 9 | Dos números (ejemplo del profe) | `Add("4,2")` | `6` |
| 10 | Muchos números (ejemplo del profe) | `Add("1,2,3,5,8,13")` | `32` |
| 11 | Mezcla coma y salto de línea (ejemplo del profe) | `Add("1,2,4\n5,6")` | `18` |
| 12 | Delimitador custom con `;` | `Add("//;\n1;3;6;4")` | `14` |
| 13 | Delimitador custom con `\|` | `Add("//\|\n1\|3\|6\|4")` | `14` |
