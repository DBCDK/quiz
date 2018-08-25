import React, {Component} from 'react';
import {connect} from 'react-redux';
import {currentScreen, quizDescription, loading} from '../redux/selectors';
import {screenAction} from '../redux/actions';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const views = {
  image: ({image}) => <img alt="" src={image} />,
  text: ({text}) => text,
  buttonGroup: ({ui}, {onAction}) =>
    ui.map((o, pos) => renderElem(o, {pos, onAction})),
  button: ({text, action}, {onAction}) => (
    <Button
      variant="contained"
      color="default"
      onClick={() => onAction(action)}
    >
      {text}
    </Button>
  )
};
function renderElem(o, {pos, onAction}) {
  const f = views[o.type];
  if (!f) {
    console.log('cannot find viewtype:', o.type);
    return;
  }
  return <div key={pos}>{f(o, {onAction})}</div>;
}

export class Widget extends Component {
  render() {
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              {this.props.quizTitle}
            </Typography>
          </Toolbar>
        </AppBar>
        {this.props.ui &&
          this.props.ui.map((o, pos) =>
            renderElem(o.toJS(), {pos, onAction: this.props.onAction})
          )}
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const description = quizDescription(state);
  const screen = currentScreen(state);
  return {
    loading: loading(state),
    quizTitle: description.get('title'),
    ui: screen.get('ui')
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    onAction: action => dispatch(screenAction(action))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Widget);
