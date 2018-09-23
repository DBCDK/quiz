import {connect} from 'react-redux';
import React, {Component} from 'react';
import uuidv4 from 'uuid/v4';

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import {ChromePicker} from 'react-color';
import DeleteIcon from '@material-ui/icons/Delete';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import style from './style';
import {withStyles} from '@material-ui/core/styles';

import {
  adminCurrentScreen,
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
  moveSection,
  adminQuizList
} from '../redux/actions';

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
          <Typography variant="button" noWrap>
            {screen
              .get('ui', [])
              .map(uiElem => uiElem.get('text', ''))
              .join(' ') + (isDispatch ? 'Quiz-afslutninger' : '')}
          </Typography>
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

export class EditQuiz extends Component {
  render() {
    const {
      questions,
      settings,
      classes,
      updateSetting,
      moveSection,
      editScreen,
      deleteSection,
      addQuestionSection,
      addInfoSection,
      adminQuizList
    } = this.props;
    return (
      <Grid container spacing={16}>
        <Button
          className={classes.button}
          fullWidth={true}
          onClick={adminQuizList}
        >
          Vælg quiz
        </Button>
        {renderDescriptionSettings({classes, settings, updateSetting})}
        {renderQuestionList({
          addQuestionSection,
          addInfoSection,
          questions,
          classes,
          moveSection,
          deleteSection,
          editScreen
        })}
        {renderVisualSettings({classes, settings, updateSetting})}
      </Grid>
    );
  }
}

function renderDescriptionSettings({classes, settings, updateSetting}) {
  return (
    <Grid item xs={12}>
      <Typography variant="headline" gutterBottom>
        Quiz beskrivelse
      </Typography>
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
function renderQuestionList({
  addQuestionSection,
  addInfoSection,
  questions,
  classes,
  moveSection,
  deleteSection,
  editScreen
}) {
  return (
    <Grid item xs={12}>
      <Typography variant="headline" gutterBottom>
        Spørgsmål og indhold
      </Typography>
      {!!questions.length &&
        draggable(
          moveSection,
          questions.map(q => {
            const id = q.get('_id');
            return {
              id,
              content: quizSection({
                classes: classes,
                screen: q,
                doEdit: () => editScreen(id),
                doDelete: () => deleteSection(id)
              })
            };
          })
        )}
      <Button
        onClick={() =>
          addQuestionSection(questions[questions.length - 1].get('_id'))
        }
      >
        <AddIcon />
        Spørgsmål
      </Button>
      <Button onClick={() => addInfoSection(questions[0].get('_id'))}>
        <AddIcon /> Beskrivelse, såsom intro-tekst
      </Button>
      <div />
    </Grid>
  );
}
function renderVisualSettings({classes, settings, updateSetting}) {
  return (
    <Grid item xs={12}>
      <Typography variant="headline" gutterBottom>
        Udseende
      </Typography>
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
      <Typography variant="title" gutterBottom>
        Spørgsmåls-knapper
      </Typography>
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

export function mapStateToProps(state, ownProps) {
  return {
    questions: questionList(state).map(questionId =>
      getScreen(questionId, state).set('_id', questionId)
    ),
    settings: quizSettings(state),
    currentScreen: getScreen(adminCurrentScreen(state), state),
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
    updateSetting: (path, setting) => dispatch(updateSetting(path, setting)),
    adminQuizList: () => dispatch(adminQuizList())
  };
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
          type: 'media',
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
          type: 'media',
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

export default withStyles(style)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditQuiz)
);
