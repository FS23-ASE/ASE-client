import React from 'react'
import { LoginGuard } from './LoginGuard'

describe('<LoginGuard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<LoginGuard />)
  })
})