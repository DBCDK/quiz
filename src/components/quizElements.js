import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  currentScreen,
  quizVariables,
  quizSettings,
  loading
} from '../redux/selectors';
import {screenAction} from '../redux/actions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import mustache from 'mustache';

export default {
  media: {
    view: ({image}, {classes}) => (
      <img alt="" src={image} className={classes.maxImageSize} />
    ),
    edit: ({image}, {updateQuizElement, classes}) => (
      <div>
        <img alt="" src={image} className={classes.maxImageSize} />,
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
    edit: () => 'TODO: redigerbar liste af svar'
  },
  button: {
    view: ({text, action}, {onAction}) => (
      <Button
        fullWidth={true}
        variant="contained"
        color="default"
        onClick={() => onAction(action)}
      >
        {text}
      </Button>
    ),
    edit: () => 'TODO: redigerbar knap'
  }
};
