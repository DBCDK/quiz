import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  currentScreen,
  quizVariables,
  quizDescription,
  loading
} from '../redux/selectors';
import {screenAction} from '../redux/actions';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import mustache from 'mustache';

const spacing = 16;

const views = {
  media: ({image}) => <img alt="" src={image} />,
  spacing: () => <p />,
  text: ({text}, {vars}) => mustache.render(text, vars),
  buttonGroup: ({ui}, {onAction}) => (
    <Grid container spacing={spacing}>
      {ui.map((o, pos) => (
        <Grid item key={pos} xs={6}>
          {renderElem(o, {pos, onAction})}
        </Grid>
      ))}
    </Grid>
  ),
  button: ({text, action}, {onAction}) => (
    <Button
      fullWidth={true}
      variant="contained"
      color="default"
      onClick={() => onAction(action)}
    >
      {text}
    </Button>
  )
};
function renderElem(o, {pos, onAction, vars}) {
  const f = views[o.type];
  if (!f) {
    console.log('cannot find viewtype:', o.type);
    return;
  }
  return f(o, {onAction, vars});
}

export class Widget extends Component {
  render() {
    return (
      <Grid container spacing={spacing}>
        <Grid item xs={12}>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="title" color="inherit">
                {this.props.quizTitle}
              </Typography>
            </Toolbar>
          </AppBar>
        </Grid>
        {this.props.ui &&
          this.props.ui.map((o, pos) => (
            <Grid key={pos} item xs={12}>
              {renderElem(o.toJS(), {
                pos,
                onAction: this.props.onAction,
                vars: this.props.vars.toJS()
              })}
            </Grid>
          ))}
      </Grid>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const description = quizDescription(state);
  const screen = currentScreen(state);
  return {
    loading: loading(state),
    vars: quizVariables(state),
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
