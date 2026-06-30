import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

Given("una partida con la palabra {string}", async ({ page }, palabra: string) => {
  await page.goto(`/?word=${palabra}`);
});

Given("una partida al azar con la semilla {int}", async ({ page }, semilla: number) => {
  await page.goto(`/?seed=${semilla}`);
});

Given("el modo de dos jugadores", async ({ page }) => {
  await page.goto(`/?modo=duo`);
});

Given(
  "una partida en nivel {string} con la palabra {string}",
  async ({ page }, nivel: string, palabra: string) => {
    await page.goto(`/?word=${palabra}&nivel=${nivel}`);
  },
);

Given(
  "una partida con la palabra {string} y la pista {string}",
  async ({ page }, palabra: string, pista: string) => {
    await page.goto(`/?word=${encodeURIComponent(palabra)}&pista=${encodeURIComponent(pista)}`);
  },
);

When("el jugador adivina la letra {string}", async ({ page }, letra: string) => {
  const input = page.getByRole("textbox");
  await input.fill(letra);
  await input.press("Enter");
});

When("el jugador presiona {string}", async ({ page }, boton: string) => {
  await page.getByRole("button", { name: boton }).click();
});

When("el jugador hace click en la tecla {string}", async ({ page }, letra: string) => {
  await page.getByRole("button", { name: letra, exact: true }).click();
});

When("el jugador 1 ingresa la palabra {string}", async ({ page }, palabra: string) => {
  await page.getByTestId("setup-word").fill(palabra);
  await page.getByRole("button", { name: "Empezar" }).click();
});

Then("se ve la palabra {string}", async ({ page }, esperada: string) => {
  await expect(page.getByTestId("word")).toHaveText(esperada);
});

Then("se ven {int} vidas", async ({ page }, vidas: number) => {
  await expect(page.getByTestId("lives")).toHaveText(String(vidas));
});

Then("se ve el mensaje {string}", async ({ page }, mensaje: string) => {
  await expect(page.getByTestId("message")).toHaveText(mensaje);
});

Then("el muñeco no tiene partes", async ({ page }) => {
  await expect(page.getByTestId("hangman")).toHaveText("");
});

Then("el muñeco muestra {string}", async ({ page }, partes: string) => {
  await expect(page.getByTestId("hangman")).toHaveText(partes);
});

Then("las letras usadas son {string}", async ({ page }, letras: string) => {
  await expect(page.getByTestId("used-keys")).toHaveText(letras);
});

Then("se ve el marcador {string}", async ({ page }, marcador: string) => {
  await expect(page.getByTestId("scoreboard")).toHaveText(marcador);
});

Then("se ve la pista {string}", async ({ page }, pista: string) => {
  await expect(page.getByTestId("hint")).toHaveText(pista);
});
