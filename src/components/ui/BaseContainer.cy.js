import React from 'react'
import BaseContainer from './BaseContainer'

describe('<BaseContainer />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<BaseContainer />)
  })
})