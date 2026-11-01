const generateUser = (suffix = Date.now()) => ({
  name: `Automation User ${suffix}`,
  email: `automation${suffix}@mail.com`,
  password: 'Pass123!'
});

const registerUser = (user) => {
  cy.visit('/login');
  cy.get('[data-qa="signup-name"]').type(user.name);
  cy.get('[data-qa="signup-email"]').type(user.email);
  cy.contains('button', 'Signup').click();

  cy.contains('b', 'Enter Account Information').should('be.visible');
  cy.get('#id_gender1').check();
  cy.get('[data-qa="password"]').type(user.password);
  cy.get('[data-qa="days"]').select('10');
  cy.get('[data-qa="months"]').select('January');
  cy.get('[data-qa="years"]').select('1995');
  cy.get('#newsletter').check();
  cy.get('#optin').check();
  cy.get('[data-qa="first_name"]').type('Automation');
  cy.get('[data-qa="last_name"]').type('Exercise');
  cy.get('[data-qa="company"]').type('QA Team');
  cy.get('[data-qa="address"]').type('123 Test Street');
  cy.get('[data-qa="country"]').select('United States');
  cy.get('[data-qa="state"]').type('Texas');
  cy.get('[data-qa="city"]').type('Houston');
  cy.get('[data-qa="zipcode"]').type('77001');
  cy.get('[data-qa="mobile_number"]').type('1234567890');
  cy.contains('button', 'Create Account').click();
  cy.contains('h2', 'Account Created!').should('be.visible');
  cy.contains('a', 'Continue').click();
};

const loginWithUser = (user) => {
  cy.visit('/login');
  cy.get('[data-qa="login-email"]').type(user.email);
  cy.get('[data-qa="login-password"]').type(user.password);
  cy.contains('button', 'Login').click();
};

const addFirstProductToCart = () => {
  cy.visit('/products');
  cy.get('.add-to-cart').first().click();
  cy.contains('a', 'View Cart').click();
};

const acceptAlert = () => {
  cy.on('window:alert', (text) => {
    expect(text).to.include('Added!');
  });
};

describe('Automation Exercise - Casos de Teste', () => {
  it('TC01 - Registrar usuário', () => {
    const user = generateUser();

    cy.visit('/login');
    cy.get('[data-qa="signup-name"]').type(user.name);
    cy.get('[data-qa="signup-email"]').type(user.email);
    cy.contains('button', 'Signup').click();

    cy.contains('b', 'Enter Account Information').should('be.visible');
    cy.get('#id_gender1').check();
    cy.get('[data-qa="password"]').type(user.password);
    cy.get('[data-qa="days"]').select('10');
    cy.get('[data-qa="months"]').select('January');
    cy.get('[data-qa="years"]').select('1995');
    cy.get('#newsletter').check();
    cy.get('#optin').check();
    cy.get('[data-qa="first_name"]').type('Automation');
    cy.get('[data-qa="last_name"]').type('Exercise');
    cy.get('[data-qa="company"]').type('QA Team');
    cy.get('[data-qa="address"]').type('123 Test Street');
    cy.get('[data-qa="country"]').select('United States');
    cy.get('[data-qa="state"]').type('Texas');
    cy.get('[data-qa="city"]').type('Houston');
    cy.get('[data-qa="zipcode"]').type('77001');
    cy.get('[data-qa="mobile_number"]').type('1234567890');
    cy.contains('button', 'Create Account').click();

    cy.contains('h2', 'Account Created!').should('be.visible');
    cy.contains('a', 'Continue').click();
    cy.contains('a', 'Logout').should('be.visible');
  });

  it('TC02 - Login com e-mail e senha corretos', () => {
    const user = generateUser();

    registerUser(user);
    cy.contains('a', 'Logout').click();
    loginWithUser(user);

    cy.contains('a', 'Logout').should('be.visible');
  });

  it('TC03 - Login com e-mail e senha incorretos', () => {
    cy.visit('/login');
    cy.get('[data-qa="login-email"]').type('wrong-email@mail.com');
    cy.get('[data-qa="login-password"]').type('WrongPassword123');
    cy.contains('button', 'Login').click();

    cy.contains('p', 'Your email or password is incorrect!').should('be.visible');
  });

  it('TC04 - Logout do usuário', () => {
    const user = generateUser();

    cy.visit('/login');
    cy.get('[data-qa="signup-name"]').type(user.name);
    cy.get('[data-qa="signup-email"]').type(user.email);
    cy.contains('button', 'Signup').click();
    cy.get('#id_gender1').check();
    cy.get('[data-qa="password"]').type(user.password);
    cy.get('[data-qa="days"]').select('10');
    cy.get('[data-qa="months"]').select('January');
    cy.get('[data-qa="years"]').select('1995');
    cy.get('[data-qa="first_name"]').type('Automation');
    cy.get('[data-qa="last_name"]').type('Exercise');
    cy.get('[data-qa="address"]').type('123 Test Street');
    cy.get('[data-qa="country"]').select('United States');
    cy.get('[data-qa="state"]').type('Texas');
    cy.get('[data-qa="city"]').type('Houston');
    cy.get('[data-qa="zipcode"]').type('77001');
    cy.get('[data-qa="mobile_number"]').type('1234567890');
    cy.contains('button', 'Create Account').click();
    cy.contains('a', 'Continue').click();

    cy.contains('a', 'Logout').click();
    cy.contains('a', 'Signup / Login').should('be.visible');
  });

  it('TC05 - Registrar usuário com e-mail já existente', () => {
    const user = generateUser();

    registerUser(user);
    cy.clearCookies();
    cy.visit('/login');
    cy.get('[data-qa="signup-name"]').type('Existing User');
    cy.get('[data-qa="signup-email"]').type(user.email);
    cy.contains('button', 'Signup').click();

    cy.contains('p', 'Email Address already exist!').should('be.visible');
  });

  it('TC08 - Verificar todos os produtos e a página de detalhes', () => {
    cy.visit('/products');
    cy.get('.features_items').should('be.visible');
    cy.get('.product-image-wrapper').should('have.length.greaterThan', 0);

    cy.visit('/product_details/1');
    cy.contains('h2', 'Blue Top').should('be.visible');
    cy.contains('span', 'Rs. 500').should('be.visible');
  });

  it('TC09 - Pesquisar produto', () => {
    cy.visit('/products');
    cy.get('#search_product').type('Blue Top');
    cy.get('#submit_search').click();

    cy.get('.features_items').should('contain.text', 'Blue Top');
    cy.get('.product-image-wrapper').should('have.length.greaterThan', 0);
  });

  it('TC10 - Verificar inscrição na página inicial', () => {
    cy.visit('/');
    cy.get('#susbscribe_email').type(`newsletter-${Date.now()}@mail.com`);
    cy.get('#subscribe').click();

    cy.get('#success-subscribe').should('be.visible').and('contain.text', 'You have been successfully subscribed!');
  });

  it('TC15 - Finalizar pedido: cadastro antes do checkout', () => {
    const user = generateUser();

    registerUser(user);
    addFirstProductToCart();

    cy.contains('a', 'Proceed To Checkout').click();
    cy.get('a.check_out').click();
    cy.get('[data-qa="name-on-card"]').type('Automation User');
    cy.get('[data-qa="card-number"]').type('4111111111111111');
    cy.get('[data-qa="cvc"]').type('123');
    cy.get('[data-qa="expiry-month"]').type('12');
    cy.get('[data-qa="expiry-year"]').type('2030');
    cy.contains('button', 'Pay and Confirm Order').click();

    cy.contains('p', 'Congratulations! Your order has been confirmed!').should('be.visible');
  });

  it('TC16 - Finalizar pedido: login antes do checkout', () => {
    const user = generateUser();

    registerUser(user);
    cy.contains('a', 'Logout').click();
    loginWithUser(user);
    addFirstProductToCart();

    cy.contains('a', 'Proceed To Checkout').click();
    cy.get('a.check_out').click();
    cy.get('[data-qa="name-on-card"]').type('Automation User');
    cy.get('[data-qa="card-number"]').type('4111111111111111');
    cy.get('[data-qa="cvc"]').type('123');
    cy.get('[data-qa="expiry-month"]').type('12');
    cy.get('[data-qa="expiry-year"]').type('2030');
    cy.contains('button', 'Pay and Confirm Order').click();

    cy.contains('p', 'Congratulations! Your order has been confirmed!').should('be.visible');
  });
});
