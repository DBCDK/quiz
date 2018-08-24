import React from 'react';
import ReactDOM from 'react-dom';
import Widget from '../Widget';
import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const tree = renderer.create(<Widget />).toJSON();
  expect(tree).toMatchSnapshot();
});
