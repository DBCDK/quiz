import {connect} from 'react-redux';
import React, {Component} from 'react';
import Immutable from 'immutable';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {Image, ImageDialog} from './ImageDialog';

import {adminCurrentScreen, getScreen} from '../redux/selectors';
import {
  editScreen,
  updateScreenElement,
  addQuestionAnswer,
  updateDispatch,
  deleteDispatch,
  addDispatch
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
function editCondition(
  condition,
  {classes, doEditScreen, doUpdateDispatch, doDeleteDispatch}
) {
  const minScore = condition.getIn(['condition', 'atLeast', 'score']);
  return (
    <Grid item xs={12} key={condition.getIn(['action', 'screen'])}>
      <Paper>
        <Image
          height={64}
          url={condition.getIn(['action', 'set', 'trophy', 'image'], '')}
        />
        <br />
        <Tooltip title="Hjælpetekst6. Mindste antal point / rigtige svar for at denne slutning vises. Slutningen med det største tilstrækkelige minimumsantal vises.">
          <TextField
            label="Mindste antal point"
            value={minScore}
            onChange={e =>
              doUpdateDispatch(o =>
                o.set(
                  'condition',
                  Immutable.fromJS({
                    atLeast: {score: Math.max(0, e.target.value)}
                  })
                )
              )
            }
            type="number"
            className={classes.margin}
          />
        </Tooltip>
        <Tooltip title="Hjælpetekst7. Pokalbillede bruges kun til indlejringen, - rediger slutning for at vælg hvordan slutningen vises ">
          <span>
            <ImageDialog
              title="Vælg pokalbillede"
              setImageUrl={url =>
                doUpdateDispatch(o =>
                  o.setIn(['action', 'set', 'trophy', 'image'], url)
                )
              }
            />
          </span>
        </Tooltip>
        <Button
          className={classes.margin}
          variant="fab"
          aria-label="Delete"
          mini
          onClick={doDeleteDispatch}
        >
          <DeleteIcon />
        </Button>
        <br />
        <Button
          variant="contained"
          color="default"
          onClick={() => doEditScreen(condition.getIn(['action', 'screen']))}
          className={classes.margin}
        >
          Rediger slutning
        </Button>
      </Paper>
    </Grid>
  );
}
function editDispatch({
  currentScreen,
  classes,
  doEditScreen,
  doUpdateDispatch,
  doDeleteDispatch,
  doAddDispatch
}) {
  return (
    <Grid container spacing={16}>
      {currentScreen
        .get('dispatch')
        .butLast()
        .map((o, pos) =>
          editCondition(o, {
            classes,
            doEditScreen,
            doUpdateDispatch: doUpdateDispatch(currentScreen.get('_id'), pos),
            doDeleteDispatch: doDeleteDispatch(currentScreen.get('_id'), pos)
          })
        )}
      <Grid item xs={12}>
        <Button
          aria-label="Add"
          mini
          onClick={() => doAddDispatch(currentScreen.get('_id'))}
        >
          <AddIcon /> Mulig slutning
        </Button>
        <br />
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
          {/* <Typography variant="h5" gutterBottom> Rediger quiz-skærm </Typography> */}
          <Button onClick={() => doEditScreen(currentScreen.get('parent', ''))}>
            <ArrowBackIcon />
            Tilbage
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
    doAddDispatch: screen => dispatch(addDispatch(screen)),
    doDeleteDispatch: (screen, pos) => () =>
      dispatch(deleteDispatch({screen, pos})),
    doUpdateScreenElement: (screen, pos) => updateFn =>
      dispatch(updateScreenElement({screen, pos, updateFn})),
    doUpdateDispatch: (screen, pos) => updateFn =>
      dispatch(updateDispatch({screen, pos, updateFn})),
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
