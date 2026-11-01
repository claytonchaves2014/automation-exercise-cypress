describe('debug payment', () => {
  it('write payment state', () => {
    const email = `debugpay-${Date.now()}@mail.com`;
    cy.visit('/login');
    cy.get('[data-qa="signup-name"]').type('Debug User');
    cy.get('[data-qa="signup-email"]').type(email);
    cy.contains('button', 'Signup').click();
    cy.get('#id_gender1').check();
    cy.get('[data-qa="password"]').type('Pass123!');
    cy.get('[data-qa="days"]').select('10');
    cy.get('[data-qa="months"]').select('January');
    cy.get('[data-qa="years"]').select('1995');
    cy.get('[data-qa="first_name"]').type('Debug');
    cy.get('[data-qa="last_name"]').type('User');
    cy.get('[data-qa="address"]').type('123');
    cy.get('[data-qa="country"]').select('United States');
    cy.get('[data-qa="state"]').type('Texas');
    cy.get('[data-qa="city"]').type('Houston');
    cy.get('[data-qa="zipcode"]').type('77001');
    cy.get('[data-qa="mobile_number"]').type('1234567890');
    cy.contains('button', 'Create Account').click();
    cy.contains('a', 'Continue').click();

    cy.visit('/products');
    cy.get('.add-to-cart').first().click();
    cy.contains('a', 'View Cart').click();
    cy.contains('a', 'Proceed To Checkout').click();
    cy.get('a.check_out').click();
    cy.url().then((url) => cy.writeFile('cypress/reports/debug-payment-url.txt', url));
    cy.get('body').then(($body) => {
      cy.writeFile('cypress/reports/debug-payment-before-submit.html', $body.html());
    });
    cy.get('[data-qa="name-on-card"]').type('Automation User');
    cy.get('[data-qa="card-number"]').type('4111111111111111');
    cy.get('[data-qa="cvc"]').type('123');
    cy.get('[data-qa="expiry-month"]').type('12');
    cy.get('[data-qa="expiry-year"]').type('2030');
    cy.contains('button', 'Pay and Confirm Order').click();
    cy.url().then((url) => cy.writeFile('cypress/reports/debug-payment-after-submit-url.txt', url));
    cy.get('body').then(($body) => {
      cy.writeFile('cypress/reports/debug-payment-after-submit.html', $body.html());
    });
  });
});
