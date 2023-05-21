import React from 'react'
import { SmallButton } from './SmallButton'

describe('<SmallButton />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<SmallButton />)
  })
})