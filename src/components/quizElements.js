import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import mustache from 'mustache';
import Immutable from 'immutable';
import marked from 'marked';

import {storage} from '../redux/openplatform';

marked.setOptions({sanitize: true});
var renderer = new marked.Renderer();
const prevLinkRenderer = renderer.link;
renderer.link = function(href, title, text) {
  return prevLinkRenderer
    .call(this, href, title, text)
    .replace('<a ', '<a target="_blank" ');
};

const quizElements = {
  media: {
    view: ({url, image}, {classes}) => {
      url = url || image || '';
      const ytRegEx = /https?:[/][/][^/]*youtube.com[/].*v=([_a-zA-Z0-9]*).*/;
      const vimeoRegEx = /https?:[/][/][^/]*vimeo.com[/].*?([0-9][0-9][0-9][0-9]+).*/;
      if (!url) {
        return;
      }

      let mediaTag;
      const width = Math.min(window.innerWidth * 0.95, 960) * 0.8;

      if (url.match(ytRegEx)) {
        const height = width * 0.5625;
        mediaTag = (
          <iframe
            width={width}
            height={height}
            src={
              'https://www.youtube.com/embed/' +
              url.match(ytRegEx)[1] +
              '?autoplay=0'
            }
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen
          />
        );
      } else if (url.match(vimeoRegEx)) {
        const height = width * 0.5625;
        mediaTag = (
          <iframe
            src={
              'https://player.vimeo.com/video/' +
              url.match(vimeoRegEx)[1] +
              '?autoplay=0'
            }
            width={width}
            height={height}
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen
          />
        );
      } else {
        mediaTag = <img alt="" src={url} className={classes.maxImageSize} />;
      }
      return <center>{mediaTag}</center>;
    },
    edit: ({url, image}, {updateQuizElement, classes}) => {
      url = url || image || '';
      return (
        <div>
          {quizElements.media.view({url}, {classes})}
          <br />
          <TextField
            fullWidth
            label="Url for billede eller youtube/vimeo-video"
            value={url}
            onChange={e =>
              updateQuizElement(ui => ui.set('url', e.target.value))
            }
          />
          <input
            accept="image/jpeg"
            className={classes.displayNone}
            id="uploadImageFile"
            type="file"
            onChange={async e => {
              try {
                const fileData = await new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.readAsBinaryString(e.target.files[0]);
                  reader.onload = () => resolve(reader.result);
                  reader.onerror = reject;
                });
                const {_id} = await storage.put({
                  _type: 'openplatform.quizImage',
                  _data: fileData
                });
                updateQuizElement(ui =>
                  ui.set('url', 'https://openplatform.dbc.dk/v3/storage/' + _id)
                );
              } catch (e) {
                // TODO show error
                console.log(e);
              }
            }}
          />
          <label htmlFor="uploadImageFile">
            <Button component="span">
              <AddIcon /> Upload billede
            </Button>
          </label>
        </div>
      );
    }
  },
  spacing: {
    view: () => <p />,
    edit: () => <p />
  },
  text: {
    view: ({text}, {vars}) => {
      if (!text) {
        return;
      }
      return (
        <Typography>
          <div
            dangerouslySetInnerHTML={{
              __html: marked(mustache.render(text, vars || {}), {renderer})
            }}
          />
        </Typography>
      );
    },

    edit: ({text}, {updateQuizElement, classes, vars}) => (
      <Grid container spacing={16}>
        <Grid item xs={6}>
          <TextField
            label="Tekst"
            fullWidth
            multiline
            rowsMax="8"
            value={text}
            onChange={e =>
              updateQuizElement(ui => ui.set('text', e.target.value))
            }
          />
        </Grid>
        <Grid item xs={6}>
          {quizElements.text.view({text}, {vars})}
        </Grid>
      </Grid>
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
    view: ({text, action, color}, {onAction, classes}) => {
      if (!text) {
        return;
      }
      return (
        <Button
          fullWidth={true}
          variant="contained"
          color={color}
          onClick={() => onAction(action)}
        >
          {text}
        </Button>
      );
    },
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
