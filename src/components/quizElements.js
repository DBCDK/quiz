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
import Typography from '@material-ui/core/Typography';
import mustache from 'mustache';

export default {
  media: {
    view: ({image}) => <img alt="" src={image} />,
    edit: ({image}, {updateQuizElement}) => (
      <div>
        <TextField
          value={image}
          onChange={e =>
            updateQuizElement(ui => ui.set('image', e.target.value))
          }
        />
        <br />
        <img alt="" src={image} />,
      </div>
    )
  },
  spacing: {
    view: () => <p />,
    edit: () => <p />
  },
  text: {
    view: ({text}, {vars}) => mustache.render(text, vars),
    edit: ({text}, {updateQuizElement}) => (
      <TextField
        multiline
        rowsMax="4"
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
    edit: 'TODO'
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
    edit: 'TODO'
  }
};
