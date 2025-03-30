describe('Display correct layout in home page', () => {
  it('should display correct title', () => {
    cy.visit(Cypress.env('home'))
    cy.contains('h1', '每天一則精選笑話').should('be.visible')
  })

  it('should display correct sub title', () => {
    cy.visit(Cypress.env('home'))
    cy.contains('p', '帶給您歡樂與放鬆。讓您的一天從微笑開始！').should('be.visible')
  })
})
