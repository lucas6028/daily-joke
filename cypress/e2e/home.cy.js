const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://daily-joke.vercel.app";

describe("Daily Joke Title Test", () => {
  it("should display the correct title", () => {
    cy.visit(baseUrl);
    cy.title().should("include", "Daily Joke");
  });
});
