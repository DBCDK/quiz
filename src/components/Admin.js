import {connect} from 'react-redux';
import React, {Component} from 'react';

import EditScreen from './EditScreen';
import EditQuiz from './EditQuiz';

import {adminCurrentScreen, getScreen, loading} from '../redux/selectors';

export class Admin extends Component {
  render() {
    if (this.props.currentScreen) {
      return <EditScreen />;
    } else {
      return <EditQuiz />;
    }
  }
}

export function mapStateToProps(state, ownProps) {
  return {
    currentScreen: getScreen(adminCurrentScreen(state), state),
    loading: loading(state)
  };
}

export default connect(mapStateToProps)(Admin);
