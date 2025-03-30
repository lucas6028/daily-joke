describe('Display correct layout in random page', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('random'))
  })

  // Validate the title text: "Random Joke"
  it('should display correct title', () => {
    cy.contains('h1', '隨機笑話').should('be.visible')
  })

  // Validate the subtitle text: "Click the button for a new random joke!"
  it('should display correct sub title', () => {
    cy.contains('p', '點一下按鈕，獲取一個新的隨機笑話！').should('be.visible')
  })
})
