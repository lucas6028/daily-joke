describe("Daily Joke Title Test", () => {
  it("should display the correct title", () => {
    cy.visit(process.env.NEXT_PUBLIC_BASE_URL);
    cy.title().should("include", "Daily Joke");
  });
});
