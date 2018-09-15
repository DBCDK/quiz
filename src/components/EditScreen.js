import {connect} from 'react-redux';
import React, {Component} from 'react';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';

import {adminCurrentScreen, getScreen} from '../redux/selectors';
import {
  editScreen,
  updateScreenElement,
  addQuestionAnswer
} from '../redux/actions';
import quizElements from './quizElements';
import style from './style';

export class EditScreen extends Component {
  render() {
    const {
      currentScreen,
      classes,
      doEditScreen,
      doUpdateScreenElement,
      doAddQuestionAnswer
    } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Typography variant="headline" gutterBottom>
            Rediger quiz-skærm
          </Typography>
          <Button onClick={() => doEditScreen(currentScreen.get('parent', ''))}>
            <ArrowBackIcon />Tilbage
          </Button>
        </Grid>
        {currentScreen.get('ui')
          ? currentScreen.get('ui').map((o, pos) => (
              <Grid key={pos} item xs={12}>
                {quizElements[o.get('type')].edit &&
                  quizElements[o.get('type')].edit(o.toJS(), {
                    classes,
                    editScreen: doEditScreen,
                    addQuestionAnswer: () =>
                      doAddQuestionAnswer(currentScreen.get('_id'), pos),
                    updateQuizElement: doUpdateScreenElement(
                      currentScreen.get('_id'),
                      pos
                    )
                  })}
              </Grid>
            ))
          : 'This screen type is not supported yet'}
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
    doEditScreen: screen => dispatch(editScreen({screen})),
    doUpdateScreenElement: (screen, pos) => updateFn =>
      dispatch(updateScreenElement({screen, pos, updateFn})),
    doAddQuestionAnswer: (screen, pos) =>
      dispatch(addQuestionAnswer([screen, pos]))
  };
}

export default withStyles(style)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditScreen)
);
