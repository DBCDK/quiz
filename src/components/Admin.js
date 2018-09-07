import {connect} from 'react-redux';
import Immutable from 'immutable';
import React, {Component} from 'react';
import uuidv4 from 'uuid/v4';
import mustache from 'mustache';

import AddIcon from '@material-ui/icons/Add';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import {ChromePicker} from 'react-color';
import DeleteIcon from '@material-ui/icons/Delete';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';

import {
  quizSettings,
  loading,
  questionList,
  getScreen
} from '../redux/selectors';
import {
  addSection,
  deleteSection,
  updateSetting,
  editScreen,
  moveSection
} from '../redux/actions';

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

function draggable(onMoveSection, items) {
  return (
    <DragDropContext
      onDragEnd={o =>
        o.destination &&
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

function quizSection({screen, doEdit, doDelete, classes}) {
  const isDispatch = !!screen.get('dispatch', false);
  return (
    <Grid container spacing={8}>
      <Grid item xs={1}>
        {!isDispatch && <DragIndicatorIcon />}
      </Grid>
      <Grid item xs={10}>
        <Button
          className={classes.button}
          variant="contained"
          fullWidth={true}
          onClick={doEdit}
        >
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
    const {questions, settings, classes, updateSetting} = this.props;
    return (
      <Grid container spacing={16}>
        {descriptionSettings({classes, settings, updateSetting})}

        <Grid item xs={12}>
          <h2>Spørgsmål og indhold</h2>
          {!!questions.length &&
            draggable(
              this.props.moveSection,
              questions.map(q => {
                const id = q.get('_id');
                return {
                  id,
                  content: quizSection({
                    classes: this.props.classes,
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
        {visualSettings({classes, settings, updateSetting})}
      </Grid>
    );
  }
}

function descriptionSettings({classes, settings, updateSetting}) {
  return (
    <Grid item xs={12}>
      <h2>Quiz beskrivelse</h2>
      <FormControl fullWidth className={classes.margin}>
        <InputLabel htmlFor="title">Titel</InputLabel>
        <Input
          id="title"
          value={settings.get('title')}
          onChange={o => updateSetting(['title'], o.target.value)}
        />
      </FormControl>
      <FormControl fullWidth className={classes.margin}>
        <InputLabel htmlFor="description">Beskrivelse</InputLabel>
        <Input
          id="description"
          value={settings.get('description')}
          onChange={o => updateSetting(['description'], o.target.value)}
        />
      </FormControl>
      <FormControl fullWidth className={classes.margin}>
        <InputLabel htmlFor="tags">Tags</InputLabel>
        <Input
          id="tags"
          value={settings
            .get('tags')
            .toJS()
            .join(' ')}
          onChange={o =>
            updateSetting(
              ['tags'],
              o.target.value.replace(/[,]/g, '').split(/ +/)
            )
          }
        />
      </FormControl>
      <FormControl fullWidth className={classes.margin}>
        <InputLabel htmlFor="image">
          Grafik (evt. Badge/pokal, hvis ikke som del af afslutning)
        </InputLabel>
        <Input
          id="image"
          value={settings.get('image', '')}
          onChange={o => updateSetting(['image'], o.target.value)}
        />
      </FormControl>
    </Grid>
  );
}
function visualSettings({classes, settings, updateSetting}) {
  return (
    <Grid item xs={12}>
      <h2>Udseende</h2>
      <FormControl fullWidth className={classes.margin}>
        <InputLabel htmlFor="backgroundImage">
          Baggrundsgrafik (til ramme, foreløbigt blot url)
        </InputLabel>
        <Input
          id="backgroundImage"
          value={settings.getIn(['style', 'backgroundImage'], '')}
          onChange={o =>
            updateSetting(['style', 'backgroundImage'], o.target.value)
          }
        />
      </FormControl>
      <h3>Spørgsmåls-knapper</h3>
      <Grid container spacing={16}>
        <Grid item>
          Fontfarve <br />
          <ChromePicker
            disableAlpha
            id="buttonFontColor"
            color={settings.getIn(['style', 'buttonFontColor'], '#ccc')}
            onChangeComplete={o =>
              updateSetting(['style', 'buttonFontColor'], o.hex)
            }
          />
        </Grid>
        <Grid item>
          Baggrundsfarve <br />
          <ChromePicker
            disableAlpha
            id="buttonColor"
            color={settings.getIn(['style', 'buttonColor'], '#ccc')}
            onChangeComplete={o =>
              updateSetting(['style', 'buttonColor'], o.hex)
            }
          />
        </Grid>
      </Grid>
    </Grid>
  );
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
    settings: quizSettings(state),
    loading: loading(state)
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    editScreen: screen => dispatch(editScreen({screen})),
    moveSection: o => dispatch(moveSection(o)),
    deleteSection: o => dispatch(deleteSection(o)),
    addQuestionSection: before => addQuestionSection(dispatch, before),
    addInfoSection: before => addInfoSection(dispatch, before),
    updateSetting: (path, setting) => dispatch(updateSetting(path, setting))
  };
}

export default withStyles(style)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Admin)
);
