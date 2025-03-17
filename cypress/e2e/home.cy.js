describe("Daily Joke Title Test", () => {
  it("should display the correct title", () => {
    cy.visit("http://localhost:3000");
    cy.title().should("include", "Daily Joke");
  });
});
