describe("Navigate to home page testin", () => {
  it("should navigate to the home page", () => {
    cy.visit("http://localhost:3000/random");
    cy.get("nav").contains("Home").click();
    cy.url().should("include", "/");
  });
});

describe("Navigate to random page testing", () => {
  it("should navigate to the random page", () => {
    cy.visit("http://localhost:3000");
    cy.get("nav").contains("Random").click();
    cy.url().should("include", "/random");
  });
});

describe("Navigate to categories page testing", () => {
  it("should navigate to the categories page", () => {
    cy.visit("http://localhost:3000");
    cy.get("nav").contains("Categories").click();
    cy.url().should("include", "/categories");
  });
});
