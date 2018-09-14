import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import mustache from 'mustache';

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
      const {updateQuizElement, editScreen, classes} = props;
      console.log(props);
      return (
        <Grid container spacing={16}>
          {ui.map((answer, pos) => (
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
                onClick={() => updateQuizElement(o => o.deleteIn(['ui', pos]))}
              >
                <DeleteIcon />
              </Button>
              TODO: point for svar
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button aria-label="Add" mini onClick={() => {}}>
              <AddIcon /> svar
            </Button>
          </Grid>
        </Grid>
      );
    }
  },
  button: {
    view: ({text, action}, {onAction, classes}) => (
      <Button
        fullWidth={true}
        variant="contained"
        color="default"
        onClick={() => onAction(action)}
      >
        {text}
      </Button>
    ),
    edit: (
      {text, action: {screen}},
      {updateQuizElement, editScreen, classes}
    ) => (
      <div>
        {text && (
          <Button
            className={classes.margin}
            fullWidth={true}
            variant="contained"
            color="default"
            onClick={() => editScreen(screen)}
          >
            {text}
          </Button>
        )}
        <br />
        <TextField
          fullWidth
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
