import React from 'react';
import ReactDOM from 'react-dom';
import {Widget, mapStateToProps} from '../Widget';
import renderer from 'react-test-renderer';
import sampleState from '../../redux/sampleState';

it('maps state to props', () => {
  expect(mapStateToProps(sampleState)).toMatchSnapshot();
});
it('renders without crashing', () => {
  const tree = renderer.create(<Widget quizTitle="Titel for Quiz" />).toJSON();
  expect(tree).toMatchSnapshot();
});
