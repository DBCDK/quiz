import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  currentScreen,
  quizVariables,
  quizSettings,
  loading
} from '../redux/selectors';
import {screenAction} from '../redux/actions';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import quizElements from './quizElements';

import {withStyles} from '@material-ui/core/styles';
import style from './style';

import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';

const spacing = 16;

function renderElement(o, opts) {
  if (!quizElements[o.type]) {
    console.log('cannot find viewtype:', o.type);
    return;
  }
  return quizElements[o.type].view(o, {...opts, renderElement});
}

export class Widget extends Component {
  render() {
    const theme = createMuiTheme({
      palette: {
        primary: {
          main: this.props.primaryColor || '#ccc'
        },
        secondary: {
          main: this.props.secondaryColor || '#ccc'
        }
      }
    });
    return (
      <MuiThemeProvider theme={theme}>
        <Grid container spacing={spacing}>
          <Grid item xs={12}>
            <AppBar position="static" color="primary">
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
                {renderElement(o.toJS(), {
                  onAction: this.props.onAction,
                  classes: this.props.classes,
                  vars: this.props.vars.toJS()
                })}
              </Grid>
            ))}
        </Grid>
      </MuiThemeProvider>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const screen = currentScreen(state);
  if (!screen) {
    return <div>"Quiz screen missing or loading..."</div>;
  }
  const settings = quizSettings(state);
  return {
    loading: loading(state),
    vars: quizVariables(state),
    quizTitle: settings.get('title'),
    ui: screen.get('ui'),
    primaryColor: settings.getIn(['style', 'primaryColor']),
    secondaryColor: settings.getIn(['style', 'secondaryColor'])
  };
}

export function mapDispatchToProps(dispatch, ownProps) {
  return {
    onAction: action => dispatch(screenAction(action))
  };
}

export default withStyles(style)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Widget)
);
