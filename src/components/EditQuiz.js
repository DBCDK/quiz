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
import ImageDialog from './ImageDialog';
import {withStyles} from '@material-ui/core/styles';

import {
  adminCurrentScreen,
  quizSettings,
  loading,
  questionList,
  getScreen
} from '../redux/selectors';
import {
  addInfoSection,
  addQuestionSection,
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
  let backgroundImage = settings.get('backgroundImage', '');
  if (backgroundImage.startsWith('openplatform:')) {
    backgroundImage =
      backgroundImage.replace(
        'openplatform:',
        'https://openplatform.dbc.dk/v3/storage/'
      ) + '?height=100';
  }
  return (
    <Grid item xs={12}>
      <Typography variant="headline" gutterBottom>
        Quiz beskrivelse
      </Typography>
      <Typography>
        Quiz id / indlejring:{' '}
        <a href={'https://dbcdk.github.io/quiz/widget?' + settings.get('_id')}>
          {settings.get('_id')}
        </a>
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
      <div>
        <img src={backgroundImage} height={100} /> <br />
        <ImageDialog
          classes={classes}
          imageUrl={settings.get('backgroundImage', '')}
          setImageUrl={url => updateSetting(['backgroundImage'], url)}
          title="Vælg baggrundsbillede"
        />
      </div>
      <FormControl fullWidth className={classes.margin}>
        <InputLabel htmlFor="image">Baggrundsbillede</InputLabel>
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
        Farveskema
      </Typography>
      <Grid container spacing={16}>
        <Grid item>
          Primærfarve
          <br />
          <ChromePicker
            disableAlpha
            id="primaryColor"
            color={settings.getIn(['style', 'primaryColor'], '#C0FFEE')}
            onChangeComplete={o =>
              updateSetting(['style', 'primaryColor'], o.hex)
            }
          />
        </Grid>
        <Grid item>
          Sekundærfarve
          <br />
          <ChromePicker
            disableAlpha
            id="buttonColor"
            color={settings.getIn(['style', 'secondaryColor'], '#BA0BAB')}
            onChangeComplete={o =>
              updateSetting(['style', 'secondaryColor'], o.hex)
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
    addQuestionSection: before => dispatch(addQuestionSection({before})),
    addInfoSection: before => dispatch(addInfoSection({before})),
    updateSetting: (path, setting) => dispatch(updateSetting(path, setting)),
    adminQuizList: () => dispatch(adminQuizList())
  };
}

export default withStyles(style)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditQuiz)
);
