import React from 'react'
import { RightButton } from './RightButton'

describe('<RightButton />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<RightButton />)
  })
})