describe('Display correct layout in random page', () => {
  it('should display correct title', () => {
    cy.visit(Cypress.env('random'))
    cy.get('h1').should('exist').and('contain.text', '隨機笑話')
  })

  it('should display correct sub title', () => {
    cy.visit(Cypress.env('random'))
    cy.get('p').should('exist').and('contain.text', '點一下按鈕，獲取一個新的隨機笑話！')
  })
})
