import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  quizDescription,
  loading,
  questionList,
  getScreen
} from '../redux/selectors';
import {editScreen} from '../redux/actions';
import DeleteIcon from '@material-ui/icons/Delete';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import mustache from 'mustache';

function quizSection({screen, doEdit}) {
  //  return "hi";
  return [
    <Grid item xs={1}>
      <DragIndicatorIcon />
    </Grid>,
    <Grid item xs={10}>
      <Button variant="contained" fullWidth={true} onClick={doEdit}>
        {screen
          .get('ui', [])
          .map(uiElem => uiElem.get('text', ''))
          .join(' ') + (screen.get('dispatch', false) ? 'dispatch' : '')}
      </Button>
    </Grid>,
    <Grid item xs={1}>
      <Button variant="fab" aria-label="Delete" mini>
        <DeleteIcon />
      </Button>
    </Grid>
  ];
}

export class Admin extends Component {
  render() {
    const questions = this.props.questions;
    return (
      <Grid container spacing={16}>
        <Grid item>[Edit description etc]</Grid>
        <Grid item>
          <Grid container spacing={8}>
            {questions.map(q => {
              const id = q.get('_id');
              return quizSection({
                screen: q,
                doEdit: () => this.props.editScreen(id)
              });
            })}
          </Grid>
        </Grid>
        <Grid item>
          <div>[Tilføj spørgsmål]</div>
          <div>[Tilføj beskrivelse, såsom intro-tekst]</div>
          <div>[Tilføj betingelser, såsom forskellige slutninger]</div>
          <div />
        </Grid>
      </Grid>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  return {
    questions: questionList(state).map(questionId =>
      getScreen(questionId, state).set('_id', questionId)
    ),
    loading: loading(state)
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    editScreen: screen => dispatch(editScreen({screen}))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin);
