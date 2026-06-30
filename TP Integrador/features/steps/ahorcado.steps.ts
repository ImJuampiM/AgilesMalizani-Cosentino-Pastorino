import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

Given("una partida con la palabra {string}", async ({ page }, palabra: string) => {
  await page.goto(`/?word=${palabra}`);
});

Given("una partida al azar con la semilla {int}", async ({ page }, semilla: number) => {
  await page.goto(`/?seed=${semilla}`);
});

When("el jugador adivina la letra {string}", async ({ page }, letra: string) => {
  const input = page.getByRole("textbox");
  await input.fill(letra);
  await input.press("Enter");
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
