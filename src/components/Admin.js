import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  quizDescription,
  loading,
  questionList,
  getScreen
} from '../redux/selectors';
import {
  addSection,
  deleteSection,
  editScreen,
  moveSection
} from '../redux/actions';
import DeleteIcon from '@material-ui/icons/Delete';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import AddIcon from '@material-ui/icons/Add';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import mustache from 'mustache';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import uuidv4 from 'uuid/v4';

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
  const isDispatch = !!screen.get('dispatch', false);
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
            .join(' ') + (isDispatch ? 'Quiz-afslutninger' : '')}
        </Button>
      </Grid>
      <Grid item xs={1}>
        {!isDispatch && (
          <Button variant="fab" aria-label="Delete" mini onClick={doDelete}>
            <DeleteIcon />
          </Button>
        )}
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
          <Button
            onClick={() =>
              this.props.addQuestionSection(
                questions[questions.length - 1].get('_id')
              )
            }
          >
            <AddIcon /> Spørgsmål
          </Button>
          <Button
            onClick={() => this.props.addInfoSection(questions[0].get('_id'))}
          >
            <AddIcon /> Beskrivelse, såsom intro-tekst
          </Button>
          <div />
        </Grid>
      </Grid>
    );
  }
}

function addQuestionSection(dispatch, before) {
  const questionId = uuidv4();
  const helpId = uuidv4();
  const answerId = uuidv4();
  const nextId = uuidv4();
  const screens = {
    [questionId]: {
      _id: questionId,
      nextSection: nextId,
      ui: [
        {
          type: 'image',
          image: ''
        },
        {type: 'text', text: 'Nyt spørgsmål...'},
        {
          type: 'buttonGroup',
          ui: [
            {
              type: 'button',
              text: 'Svar',
              action: {
                screen: answerId,
                increment: {
                  score: 1,
                  maxScore: 1
                }
              }
            }
          ]
        },
        {type: 'spacing'},
        {
          type: 'button',
          text: 'hjælp',
          action: {screen: helpId}
        }
      ]
    },
    [helpId]: {
      _id: helpId,
      parent: questionId,
      ui: [
        {type: 'text', text: 'Hint til spørgsmål'},
        {
          type: 'button',
          text: 'Tilbage til spørgsmålet',
          action: {screen: questionId}
        }
      ]
    },
    [answerId]: {
      _id: answerId,
      parent: questionId,
      ui: [
        {
          type: 'text',
          text: 'Feedback på besvarelsen'
        },
        {type: 'button', text: 'Fortsæt', action: {screen: nextId}}
      ],
      log: true
    }
  };
  return dispatch(addSection({before, screenId: questionId, screens}));
}

function addInfoSection(dispatch, before) {
  const sectionId = uuidv4();
  const nextId = uuidv4();
  const screens = {
    [sectionId]: {
      _id: sectionId,
      nextSection: nextId,
      ui: [
        {
          type: 'image',
          image: ''
        },
        {type: 'text', text: 'Beskrivelse, såsom intro...'},
        {type: 'spacing'},
        {
          type: 'button',
          text: 'Start',
          action: {screen: nextId}
        }
      ]
    }
  };
  return dispatch(addSection({before, screenId: sectionId, screens}));
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
    deleteSection: o => dispatch(deleteSection(o)),
    addQuestionSection: before => addQuestionSection(dispatch, before),
    addInfoSection: before => addInfoSection(dispatch, before)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin);
