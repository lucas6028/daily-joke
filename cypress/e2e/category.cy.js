describe('Display correct layout', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('categories'))
  })

  // Validate the title text: "Joke Categories"
  it('should display correct title', () => {
    cy.contains('h1', '笑話分類').should('be.visible')
  })

  // Validate the subtitle text: "Browse jokes by your favorite topics"
  it('should display correct sub title', () => {
    cy.contains('p', '按你最愛的主題瀏覽笑話，笑點隨你挑！').should('be.visible')
  })
})

describe('Category navigation test', () => {
  const categories = [
    'dirty',
    'pun',
    'absurd',
    'misunderstanding',
    'technology',
    'animal',
    'idiom',
    'sports',
    'jingle',
    'programming',
    'math',
    'stock',
  ]

  it('should navigate to the correct category', () => {
    cy.visit(Cypress.env('categories'))
    for (const category of categories) {
      cy.contains('h2', category).should('be.visible').click()
      cy.url().should('include', '/' + category)
      cy.get('.joke-card').should('exist').and('be.visible') // Check joke card exist
      cy.wait(1000) // Allow page to fully load before navigating back
      cy.go('back') // Navigate back to test the next category
    }
  })
})
