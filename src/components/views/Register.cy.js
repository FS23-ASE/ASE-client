import React from 'react';
import Register from './Register';

describe('<Register />', () => {
  it('renders', () => {
// see: https://on.cypress.io/mounting-react
    cy.mount(<Register />);
  });

  it('registers a new user', () => {
    const mockUser = {
      id: 'mockUserId',
      token: 'mockToken'
    };
    cy.intercept('POST', '/users', {
      statusCode: 200,
      body: mockUser
    }).as('registerRequest');

    cy.mount(<Register />);

    cy.contains('Register').click();

  });
});
