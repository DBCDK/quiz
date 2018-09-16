import {connect} from 'react-redux';
import React, {Component} from 'react';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import {adminCurrentScreen, getScreen} from '../redux/selectors';
import {
  editScreen,
  updateScreenElement,
  addQuestionAnswer
} from '../redux/actions';
import quizElements from './quizElements';
import style from './style';

function editUI({
  currentScreen,
  classes,
  doEditScreen,
  doUpdateScreenElement,
  doAddQuestionAnswer
}) {
  return currentScreen.get('ui').map((o, pos) => (
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
  ));
}
function editCondition(condition, {classes, doEditScreen}) {
  const minScore = condition.getIn(['condition', 'atLeast', 'score']);
  return (
    <Grid item xs={12} key={condition.getIn(['action', 'screen'])}>
      <Paper>
        <TextField
          label="Mindste antal point"
          value={minScore}
          onChange={e => console.log('TODO: change minScore')}
          type="number"
          className={classes.margin}
        />
        <Button
          variant="contained"
          color="default"
          onClick={() => doEditScreen(condition.getIn(['action', 'screen']))}
          className={classes.margin}
        >
          Rediger slutning
        </Button>
        <TextField
          className={classes.margin}
          label="Url for pokalbilled"
          value="some://url"
          onChange={e => console.log('TODO update pokalurl', e.target.value)}
        />
        <Button
          className={classes.margin}
          variant="fab"
          aria-label="Delete"
          mini
          onClick={() => console.log('TODO: delete')}
        >
          <DeleteIcon />
        </Button>
      </Paper>
    </Grid>
  );
}
function editDispatch({currentScreen, classes, doEditScreen}) {
  return (
    <Grid container spacing={16}>
      {currentScreen
        .get('dispatch')
        .butLast()
        .map(o => editCondition(o, {classes, doEditScreen}))}
      <Grid item xs={12}>
        <Button aria-label="Add" mini onClick={addQuestionAnswer}>
          <AddIcon /> Mulig slutning
        </Button>
        <Button
          variant="contained"
          color="default"
          onClick={() =>
            doEditScreen(
              currentScreen
                .get('dispatch')
                .last()
                .getIn(['action', 'screen'])
            )
          }
          className={classes.margin}
        >
          Rediger default slutning
        </Button>
      </Grid>
    </Grid>
  );
}

export class EditScreen extends Component {
  render() {
    const {currentScreen, doEditScreen} = this.props;
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
          ? editUI(this.props)
          : currentScreen.get('dispatch')
            ? editDispatch(this.props)
            : 'Error: unsupported screen'}
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
