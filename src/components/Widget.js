import React, {Component} from 'react';
import {connect} from 'react-redux';
import {currentScreen, quizDescription, loading} from '../redux/selectors';

export class Widget extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.quizTitle}</h1>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const description = quizDescription(state);
  return {
    loading: loading(state),
    quizTitle: description.get('title'),
    screen: currentScreen(state)
  };
}

export default connect(mapStateToProps)(Widget);
