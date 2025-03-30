const categories = [
  'Dirty',
  'Pun',
  'Absurd',
  'Misunderstanding',
  'Technology',
  'Animal',
  'Idiom',
  'Sports',
  'Jingle',
  'Programming',
]

describe('Display correct layout', () => {
  it('should display correct title', () => {
    cy.visit(Cypress.env('categories'))
    cy.get('h1').should('exist').and('contain.text', '笑話分類')
  })

  it('should display correct sub title', () => {
    cy.visit(Cypress.env('categories'))
    cy.get('p').should('exist').and('contain.text', '按你最愛的主題瀏覽笑話，笑點隨你挑！')
  })
})

/*
describe('Category navigation test', () => {
  it('should navigate to the correct category', () => {
    cy.visit(baseUrl + '/categories')
    for (const category of categories) {
      const cat = category.toLowerCase(category)
      cy.get('h2').should('contain.text', cat).click({ multiple: true })
      cy.url().should('include', '/' + cat)
    }
  })
})
*/
