describe("Navigate to random page testing", () => {
  it("should navigate to the random page", () => {
    cy.visit(
      process.env.NEXT_PUBLIC_BASE_URL || "https://daily-joke.vercel.app"
    );
    cy.get("nav").contains("Random").click();
    cy.url().should("include", "/random");
  });
});

describe("Navigate to categories page testing", () => {
  it("should navigate to the categories page", () => {
    cy.visit(
      (process.env.NEXT_PUBLIC_BASE_URL || "https://daily-joke.vercel.app") +
        "/categories"
    );
    cy.get("nav").contains("Categories").click();
    cy.url().should("include", "/categories");
  });
});

describe("Navigate to home page testin", () => {
  it("should navigate to the home page", () => {
    cy.visit(
      (process.env.NEXT_PUBLIC_BASE_URL || "https://daily-joke.vercel.app") +
        "/random"
    );
    cy.get("nav").contains("Home").click();
    cy.url().should("include", "/");
  });
});

describe("Navigate to home page by clicking the logo", () => {
  it("should navigate to the home page", () => {
    cy.visit(
      (process.env.NEXT_PUBLIC_BASE_URL || "https://daily-joke.vercel.app") +
        "/random"
    );
    cy.get("nav").contains("Home").click();
    cy.url().should("include", "/");
  });
});

describe("Change the theme to dark mode", () => {
  it("should change the theme to dark mode", () => {
    cy.visit(
      process.env.NEXT_PUBLIC_BASE_URL || "https://daily-joke.vercel.app"
    );

    // Target the theme toggle button by its aria label instead
    cy.get(
      'button[aria-label="Toggle theme"], button:has(span.sr-only:contains("Toggle theme"))'
    ).click();

    // Look for the dropdown item in the entire document, not just nav
    cy.contains("Dark").click();

    // Add a short wait to allow theme to be applied
    cy.wait(500);

    // Check for dark mode
    cy.get("html").should("have.class", "dark");
  });
});

describe("Change the theme to light mode", () => {
  it("should change the theme to light mode", () => {
    cy.visit(
      process.env.NEXT_PUBLIC_BASE_URL || "https://daily-joke.vercel.app"
    );

    // Target the theme toggle button by its aria label instead
    cy.get(
      'button[aria-label="Toggle theme"], button:has(span.sr-only:contains("Toggle theme"))'
    ).click();

    // Look for the dropdown item in the entire document, not just nav
    cy.contains("Light").click();

    // Add a short wait to allow theme to be applied
    cy.wait(500);

    // Check for dark mode
    cy.get("html").should("have.class", "light");
  });
});
