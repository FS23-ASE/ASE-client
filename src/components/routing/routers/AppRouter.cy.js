import React from 'react'
import AppRouter from './AppRouter'

describe('<AppRouter />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AppRouter />)
  })
})