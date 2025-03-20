import React from "react";
import Header from "@/components/header";

describe("Check the header display properly", () => {
  it("should display the title", () => {
    cy.mount(<Header />);
    cy.get("span")
      .should("have.class", "hidden sm:inline-block")
      .contains("Daily Joke");
  });

  it("should display the logo", () => {
    cy.mount(<Header />);
    cy.get("img").should("have.attr", "src", "/favicon.svg");
  });

  it("should display the navigation links", () => {
    cy.mount(<Header />);
    cy.get("nav").contains("Home");
    cy.get("nav").contains("Random");
    cy.get("nav").contains("Categories");
  });

  it("should display the theme toggle button", () => {
    cy.mount(<Header />);
    cy.get(
      'button[aria-label="Toggle theme"], button:has(span.sr-only:contains("Toggle theme"))'
    ).contains("Toggle theme");
  });
});
