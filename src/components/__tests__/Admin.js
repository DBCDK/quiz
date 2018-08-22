import React from 'react';
import ReactDOM from 'react-dom';
import Admin from '../Admin';
import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const tree = renderer.create(<Admin />).toJSON();
  expect(tree).toMatchSnapshot();
});
