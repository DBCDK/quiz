import {connect} from 'react-redux';
import React, {Component} from 'react';

import EditScreen from './EditScreen';
import EditQuiz from './EditQuiz';
import QuizList from './QuizList';

import {
  adminCurrentScreen,
  currentQuiz,
  getScreen,
  loading
} from '../redux/selectors';

export class Admin extends Component {
  render() {
    if (this.props.currentScreen) {
      return <EditScreen />;
    }
    if (this.props.currentQuiz) {
      return <EditQuiz />;
    }
    return <QuizList />;
  }
}

export function mapStateToProps(state, ownProps) {
  return {
    currentScreen: getScreen(adminCurrentScreen(state), state),
    currentQuiz: currentQuiz(state),
    loading: loading(state)
  };
}

export default connect(mapStateToProps)(Admin);
