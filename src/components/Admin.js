import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  quizDescription,
  loading,
  questionList,
  getScreen
} from '../redux/selectors';
import {deleteSection, editScreen, moveSection} from '../redux/actions';
import DeleteIcon from '@material-ui/icons/Delete';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import mustache from 'mustache';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

function draggable(onMoveSection, items) {
  return (
    <DragDropContext
      onDragEnd={o =>
        onMoveSection({
          id: o.draggableId,
          from: o.source.index,
          to: o.destination.index,
          screens: items.map(o => o.id)
        })
      }
    >
      <Droppable droppableId="droppable">
        {(droppableProvided, droppableSnapshot) => (
          <div ref={droppableProvided.innerRef}>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                  >
                    {item.content}
                  </div>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

function quizSection({screen, doEdit, doDelete}) {
  //  return "hi";
  return (
    <Grid container spacing={8}>
      <Grid item xs={1}>
        <DragIndicatorIcon />
      </Grid>
      <Grid item xs={10}>
        <Button variant="contained" fullWidth={true} onClick={doEdit}>
          {screen
            .get('ui', [])
            .map(uiElem => uiElem.get('text', ''))
            .join(' ') + (screen.get('dispatch', false) ? 'dispatch' : '')}
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button variant="fab" aria-label="Delete" mini onClick={doDelete}>
          <DeleteIcon />
        </Button>
      </Grid>
    </Grid>
  );
}

export class Admin extends Component {
  render() {
    const questions = this.props.questions;
    return (
      <Grid container spacing={16}>
        <Grid item>[Edit description etc]</Grid>
        <Grid item>
          {!!questions.length &&
            draggable(
              this.props.moveSection,
              questions.map(q => {
                const id = q.get('_id');
                return {
                  id,
                  content: quizSection({
                    screen: q,
                    doEdit: () => this.props.editScreen(id),
                    doDelete: () => this.props.deleteSection(id)
                  })
                };
              })
            )}
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
    editScreen: screen => dispatch(editScreen({screen})),
    moveSection: o => dispatch(moveSection(o)),
    deleteSection: o => dispatch(deleteSection(o))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin);
