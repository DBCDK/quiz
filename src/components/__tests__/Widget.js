import React from 'react';
import ReactDOM from 'react-dom';
import {Widget, mapStateToProps, mapDispatchToProps} from '../Widget';
import renderer from 'react-test-renderer';
import sampleState from '../../redux/sampleState';
import Immutable from 'immutable';

it('maps state to props', () => {
  expect(mapStateToProps(sampleState)).toMatchSnapshot();
});
it('maps dispatch to props', () => {
  expect(mapDispatchToProps(() => {})).toMatchSnapshot();
});
it('renders', () => {
  const tree = renderer.create(<Widget quizTitle="Titel for Quiz" />).toJSON();
  expect(tree).toMatchSnapshot();
});
it('renders page', () => {
  const page = Immutable.fromJS([
    {type: 'text', text: 'hello'},
    {
      type: 'buttonGroup',
      ui: [{type: 'button', text: 'but'}]
    },
    {type: 'image', image: 'some://url'}
  ]);
  const tree = renderer
    .create(
      <Widget
        quizTitle="Titel for Quiz"
        ui={page}
        vars={Immutable.fromJS({})}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
