import React from 'react';
import ReactDOM from 'react-dom';
import {mapStateToProps, mapDispatchToProps} from '../Widget';
import Widget from '../Widget';
import renderer from 'react-test-renderer';
import {sampleState} from '../../redux/sampleState';
import Immutable from 'immutable';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {testQuiz1} from '../../testData';

it('maps state to props', () => {
  expect(mapStateToProps(sampleState)).toMatchSnapshot();
});
it('maps dispatch to props', () => {
  expect(mapDispatchToProps(() => {})).toMatchSnapshot();
});

const testState = sampleState.set('quiz', Immutable.fromJS(testQuiz1));

const stateStore = initialState =>
  createStore((state = initialState, action) => state);

const renderFromState = state =>
  renderer
    .create(
      <Provider store={stateStore(state)}>
        <Widget
          vars={Immutable.fromJS({correct: 3, score: 5, questionCount: 4})}
        />
      </Provider>
    )
    .toJSON();

it('renders info pages', () => {
  expect(
    renderFromState(testState.setIn(['widget', 'currentScreen'], 'intro'))
  ).toMatchSnapshot();
  expect(
    renderFromState(
      testState.setIn(['widget', 'currentScreen'], 'question1help')
    )
  ).toMatchSnapshot();
});
it('renders different endings', () => {
  expect(
    renderFromState(
      testState.setIn(
        ['widget', 'currentScreen'],
        '82e6df55-a1f8-4cd6-9ced-4ad8a997b04b'
      )
    )
  ).toMatchSnapshot();
  expect(
    renderFromState(
      testState.setIn(
        ['widget', 'currentScreen'],
        'd485421a-b9c4-43f6-a52e-bc1984381e66'
      )
    )
  ).toMatchSnapshot();
  expect(
    renderFromState(
      testState.setIn(
        ['widget', 'currentScreen'],
        '57b4bccd-1bfe-471b-87e4-6bb6a642fd66'
      )
    )
  ).toMatchSnapshot();
});

it('renders a question', () => {
  expect(
    renderFromState(testState.setIn(['widget', 'currentScreen'], 'question1'))
  ).toMatchSnapshot();
});

it('a quiz', () => {
  const tree = renderFromState(testState);
  expect(tree).toMatchSnapshot();
});
