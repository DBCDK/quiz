import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import mustache from 'mustache';
import Immutable from 'immutable';

const quizElements = {
  media: {
    view: ({image}, {classes}) => (
      <img alt="" src={image} className={classes.maxImageSize} />
    ),
    edit: ({image}, {updateQuizElement, classes}) => (
      <div>
        <img alt="" src={image} className={classes.maxImageSize} />
        <br />
        <TextField
          fullWidth
          label="Url for billede"
          value={image}
          onChange={e =>
            updateQuizElement(ui => ui.set('image', e.target.value))
          }
        />
      </div>
    )
  },
  spacing: {
    view: () => <p />,
    edit: () => <p />
  },
  text: {
    view: ({text}, {vars}) => mustache.render(text, vars),
    edit: ({text}, {updateQuizElement, classes}) => (
      <TextField
        label="Tekst"
        fullWidth
        multiline
        rowsMax="8"
        value={text}
        onChange={e => updateQuizElement(ui => ui.set('text', e.target.value))}
      />
    )
  },
  buttonGroup: {
    view: ({ui}, {onAction, renderElement}) => (
      <Grid container spacing={16}>
        {ui.map((o, pos) => (
          <Grid item key={pos} xs={6}>
            {renderElement(o, {onAction})}
          </Grid>
        ))}
      </Grid>
    ),
    edit: ({ui}, props) => {
      const {updateQuizElement, classes, addQuestionAnswer} = props;
      return (
        <Grid container spacing={16}>
          {ui.map((answer, pos) => {
            const scoreIncrement =
              (answer.action &&
                answer.action.increment &&
                +answer.action.increment.score) ||
              0;
            return (
              <Grid item key={pos} xs={6}>
                {answer.type === 'button' &&
                  quizElements.button.edit(answer, {
                    ...props,
                    updateQuizElement: f =>
                      updateQuizElement(o => o.updateIn(['ui', pos], f))
                  })}
                <Button
                  className={classes.margin}
                  variant="fab"
                  aria-label="Delete"
                  mini
                  onClick={() =>
                    updateQuizElement(o => o.deleteIn(['ui', pos]))
                  }
                >
                  <DeleteIcon />
                </Button>
                <TextField
                  label="Point for svar"
                  value={scoreIncrement}
                  onChange={e =>
                    updateQuizElement(o =>
                      o.setIn(
                        ['ui', pos, 'action', 'increment'],
                        Immutable.fromJS({
                          score: Math.max(+e.target.value, 0),
                          correct: +e.target.value ? 1 : 0
                        })
                      )
                    )
                  }
                  type="number"
                  className={classes.margin}
                />
              </Grid>
            );
          })}
          <Grid item xs={12}>
            <Button aria-label="Add" mini onClick={addQuestionAnswer}>
              <AddIcon /> svar
            </Button>
          </Grid>
        </Grid>
      );
    }
  },
  button: {
    view: ({text, action, color}, {onAction, classes}) =>
      text && (
        <Button
          fullWidth={true}
          variant="contained"
          color={color}
          onClick={() => onAction(action)}
        >
          {text}
        </Button>
      ),
    edit: ({text, action, color}, {updateQuizElement, editScreen, classes}) => (
      <div>
        {quizElements.button.view(
          {text, action, color},
          {onAction: () => editScreen(action.screen), classes}
        )}
        <br />
        <TextField
          fullWidth
          className={classes.margin}
          label="Tekst til knap"
          value={text}
          onChange={e =>
            updateQuizElement(ui => ui.set('text', e.target.value))
          }
        />
      </div>
    )
  }
};
export default quizElements;
