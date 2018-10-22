import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import mustache from 'mustache';
import Immutable from 'immutable';
import marked from 'marked';
import ImageDialog from './ImageDialog';

function imageUrl({url, width, height}) {
  if (url.startsWith('openplatform:')) {
    url =
      url.replace('openplatform:', 'https://openplatform.dbc.dk/v3/storage/') +
      (width ? '?width=' + width : height ? '?height=' + height : '');
  }
  return url;
}

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
    view: ({url, image}, {classes, width}) => {
      url = url || image || '';
      const ytRegEx = /https?:[/][/][^/]*youtube.com[/].*v=([_a-zA-Z0-9]*).*/;
      const vimeoRegEx = /https?:[/][/][^/]*vimeo.com[/].*?([0-9][0-9][0-9][0-9]+).*/;
      if (typeof url !== 'string' || url === '') {
        return;
      }

      let mediaTag;

      const calculatedWidth = Math.floor(
        width || Math.min(window.innerWidth * 0.95, 960) * 0.8
      );
      if (url.match(ytRegEx)) {
        const height = calculatedWidth * 0.5625;
        mediaTag = (
          <iframe
            title="YouTube Video"
            width={calculatedWidth}
            height={height}
            src={
              'https://www.youtube.com/embed/' +
              url.match(ytRegEx)[1] +
              '?autoplay=0'
            }
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        );
      } else if (url.match(vimeoRegEx)) {
        const height = calculatedWidth * 0.5625;
        mediaTag = (
          <iframe
            title="Vimeo Video"
            src={
              'https://player.vimeo.com/video/' +
              url.match(vimeoRegEx)[1] +
              '?autoplay=0'
            }
            width={calculatedWidth}
            height={height}
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        );
      } else {
        mediaTag = (
          <img
            alt=""
            src={imageUrl({url, width})}
            width={width}
            className={classes.maxImageSize}
          />
        );
      }
      return <center>{mediaTag}</center>;
    },
    edit: ({url, image}, {updateQuizElement, classes}) => {
      url = url || image || '';
      return (
        <div>
          {quizElements.media.view({url}, {classes})}
          <br />
          <ImageDialog
            classes={classes}
            imageUrl={url}
            setImageUrl={imageUrl =>
              updateQuizElement(ui => ui.set('url', imageUrl))
            }
          />
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
        <Typography headlineMapping={{body1: 'div'}}>
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
    view: ({text, action, color, image}, {onAction, classes}) => {
      if (!text && !image) {
        return;
      }
      return (
        <Button
          fullWidth={true}
          variant="contained"
          color={color}
          onClick={() => onAction(action)}
        >
          {image && (
            <img
              style={{borderRadius: 4}}
              src={imageUrl({url: image, height: 64})}
              height={64}
              alt={text}
            />
          )}
          {image && <span>&nbsp;</span>}
          {text}
        </Button>
      );
    },
    edit: (
      {text, action, color, image},
      {updateQuizElement, editScreen, classes}
    ) => (
      <div>
        {quizElements.button.view(
          {text, action, color, image},
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
        <ImageDialog
          classes={classes}
          imageUrl={image}
          title="Vælg Knap-billede"
          setImageUrl={imageUrl => {
            updateQuizElement(ui => ui.set('image', imageUrl));
          }}
        />
        <Button onClick={() => updateQuizElement(ui => ui.set('image', ''))}>
          Fjen knap-billede
        </Button>
      </div>
    )
  }
};
export default quizElements;
