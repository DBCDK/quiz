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
import {imageUrl} from './ImageDialog';

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
    const classes = this.props.classes || undefined;
    let backgroundImage = this.props.backgroundImage;
    return (
      <MuiThemeProvider theme={theme}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              {this.props.quizTitle}
            </Typography>
          </Toolbar>
        </AppBar>
        <center
          style={{
            background:
              backgroundImage &&
              `url("${imageUrl({
                url: backgroundImage,
                width: window.innerWidth
              })}") no-repeat center center fixed`,
            backgroundSize: 'cover'
          }}
        >
          <div style={{backgroundColor: this.props.backgroundColor}}>
            <Grid container spacing={spacing} className={classes.container}>
              <Grid item xs={12} />
              {this.props.ui &&
                this.props.ui.map((o, pos) => {
                  const element = renderElement(o.toJS(), {
                    onAction: this.props.onAction,
                    classes,
                    vars: this.props.vars.toJS()
                  });
                  if (!element) {
                    return undefined;
                  }
                  return (
                    element && (
                      <Grid key={pos} item xs={12}>
                        {element}
                      </Grid>
                    )
                  );
                })}
            </Grid>
          </div>
        </center>
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
  let backgroundColor;
  try {
    const c = JSON.parse(settings.getIn(['style', 'backgroundColor']));
    backgroundColor = `rgba(${c.r},${c.g},${c.b},${c.a})`;
  } catch (e) {
    backgroundColor = `rgba(255,255,255,0.7)`;
  }
  return {
    loading: loading(state),
    vars: quizVariables(state),
    quizTitle: settings.get('title'),
    ui: screen.get('ui'),
    backgroundImage: settings.getIn(['backgroundImage']),
    primaryColor: settings.getIn(['style', 'primaryColor']),
    secondaryColor: settings.getIn(['style', 'secondaryColor']),
    backgroundColor
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
