describe('Display correct layout in random page', () => {
  it('should display correct title', () => {
    cy.visit(Cypress.env('random'))
    cy.contains('h1', '隨機笑話').should('be.visible')
  })

  it('should display correct sub title', () => {
    cy.visit(Cypress.env('random'))
    cy.contains('p', '點一下按鈕，獲取一個新的隨機笑話！').should('be.visible')
  })
})
