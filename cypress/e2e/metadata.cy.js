describe('Daily Joke Title Test', () => {
  it('should display the correct title', () => {
    cy.visit(Cypress.env('home'))
    cy.title().should('include', 'Daily Joke')
  })
})
