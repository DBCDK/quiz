import React from 'react';
import ReactDOM from 'react-dom';
import {Widget, mapStateToProps} from '../Widget';
import renderer from 'react-test-renderer';
import sampleState from '../../redux/sampleState';

it('maps state to props', () => {
  expect(mapStateToProps(sampleState)).toMatchSnapshot();
});
it('renders', () => {
  const tree = renderer.create(<Widget quizTitle="Titel for Quiz" />).toJSON();
  expect(tree).toMatchSnapshot();
});
it('renders page', () => {
  const page = [
    {type: 'text', text: 'hello'},
    {
      type: 'buttonGroup',
      ui: [{type: 'button', text: 'but'}]
    },
    {type: 'image', image: 'some://url'}
  ];
  const tree = renderer.create(<Widget quizTitle="Titel for Quiz" />).toJSON();
  expect(tree).toMatchSnapshot();
});
