describe('Display correct layout in home page', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('home'))
  })

  it('should display correct title', () => {
    cy.contains('h1', '每天一則精選笑話').should('be.visible')
  })

  it('should display correct sub title', () => {
    cy.contains('p', '帶給您歡樂與放鬆。讓您的一天從微笑開始！').should('be.visible')
  })
})
