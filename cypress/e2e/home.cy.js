describe("Daily Joke Title Test", () => {
  it("should display the correct title", () => {
    const baseUrl = Cypresss.env("BASE_URL");
    cy.visit(baseUrl);
    cy.title().should("include", "Daily Joke");
  });
});
