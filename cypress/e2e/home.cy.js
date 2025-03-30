describe('Display correct layout in home page', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('home'))
  })

  // Validates the tilte text: "Joke of the Day"
  it('should display correct title', () => {
    cy.contains('h1', '每天一則精選笑話').should('be.visible')
  })
  
  // Validates the subtitle text: "Bringing you joy and relaxation. Start your day with a smile!"
  it('should display correct sub title', () => {
    cy.contains('p', '帶給您歡樂與放鬆。讓您的一天從微笑開始！').should('be.visible')
  })

  it('should display joke card', () => {
    cy.get('.joke-card').should('exist').and('be.visible')
  })
})
