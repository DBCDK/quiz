import {connect} from 'react-redux';
import React, {Component} from 'react';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';

import {adminCurrentScreen, getScreen} from '../redux/selectors';
import {editScreen} from '../redux/actions';

const style = theme => ({
  button: {
    overflow: 'hidden',
    height: 36
  },
  margin: {
    margin: 8
  },
  input: {
    display: 'none'
  }
});

export class EditScreen extends Component {
  render() {
    const {currentScreen, editScreen} = this.props;
    return (
      <Grid container spacing={16}>
        <Grid item>
          <Typography variant="headline" gutterBottom>
            Rediger quiz-skærm
          </Typography>
          <Button onClick={() => editScreen(currentScreen.get('parent', ''))}>
            <ArrowBackIcon />Tilbage
          </Button>
        </Grid>
      </Grid>
    );
  }
}
export function mapStateToProps(state, ownProps) {
  return {
    currentScreen: getScreen(adminCurrentScreen(state), state)
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    editScreen: screen => dispatch(editScreen({screen}))
  };
}

export default withStyles(style)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditScreen)
);
