describe('Test navigation in header', () => {
  it('should navigate to the random page', () => {
    cy.visit(Cypress.env('home'))
    cy.get('nav').contains('Random').click()
    cy.url().should('include', '/random')
  })
})

it('should navigate to the categories page', () => {
  cy.visit(Cypress.env('home'))
  cy.get('nav').contains('Categories').click()
  cy.url().should('include', '/categories')
})

it('should navigate to the home page', () => {
  cy.visit(Cypress.env('random'))
  cy.get('nav').contains('Home').click()
  cy.url().should('include', '/')
})
it('should navigate to the home page', () => {
  cy.visit(Cypress.env('random'))
  cy.get('nav').contains('Home').click()
  cy.url().should('include', '/')
})

describe('Change the theme of website', () => {
  it('should navigate to the home page', () => {
    cy.visit(Cypress.env('random'))
    cy.get('nav').contains('Home').click()
    cy.url().should('include', '/')
  })

  it('should change the theme to dark mode', () => {
    cy.visit(Cypress.env('home'))

    // Target the theme toggle button by its aria label instead
    cy.get(
      'button[aria-label="Toggle theme"], button:has(span.sr-only:contains("Toggle theme"))'
    ).click()

    // Look for the dropdown item in the entire document, not just nav
    cy.contains('Dark').click()

    // Add a short wait to allow theme to be applied
    cy.wait(500)

    // Check for dark mode
    cy.get('html').should('have.class', 'dark')
  })
})
