import React from 'react';
import ReactDOM from 'react-dom';
import {render, cleanup} from "@testing-library/react";
import renderer from 'react-test-renderer';
import App from './App';
import expect from "expect";

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
  expect(asFragment(<App />)).toMatchSnapshot();
});
