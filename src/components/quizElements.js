import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import mustache from 'mustache';
import Immutable from 'immutable';
import marked from 'marked';
import {Image, ImageDialog} from './ImageDialog';

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
      const ytRegEx = /https?:[/][/][^/]*youtube.com[/].*v=([^&]*).*/;
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
          <Image url={url} width={width} className={classes.maxImageSize} />
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
      try {
        text = mustache.render(text, vars || {});
      } catch (e) {
        text = '**' + String(e) + '**\n\n' + text;
      }
      return (
        <Typography headlineMapping={{body1: 'div'}}>
          <div
            dangerouslySetInnerHTML={{
              __html: marked(text, {renderer})
            }}
          />
        </Typography>
      );
    },

    edit: ({text}, {updateQuizElement, classes, vars}) => (
      <Grid container spacing={16}>
        <Grid item xs={6}>
          <Tooltip
            title={
              <div>
                Hjælpetekst8
                <p>
                  Teksten man skriver her kan indeholde variable i dobbelte
                  krøllede paranteser: <em>{'{{questionCount}}'}</em> er
                  antallet af spørgsmål brugeren har besvaret,{' '}
                  <em>{'{{correct}}'}</em> er antallet af korrekte besvarede
                  spørgsmål og <em>{'{{score}}'}</em> er antallet af point.
                </p>
                <p>
                  {' '}
                  Teksten kan formateres med markdown: URL'er bliver lavet om
                  til links. Linjer der starter med et antal havelåger(#) bliver
                  lavet til overskrifter, og så videre. Søg efter "Markdown"
                  online, for at finde yderligere vejledning til formattering.
                </p>
              </div>
            }
          >
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
          </Tooltip>
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
                <TextField
                  label="Point for svar"
                  value={scoreIncrement}
                  onChange={e =>
                    updateQuizElement(o =>
                      o.setIn(
                        ['ui', pos, 'action', 'increment'],
                        Immutable.fromJS({
                          score: Math.max(+e.target.value, 0),
                          correct: +e.target.value ? 1 : 0,
                          questionCount: 1
                        })
                      )
                    )
                  }
                  type="number"
                  className={classes.margin}
                />
                <br />
                <Button
                  className={classes.margin}
                  variant="contained"
                  aria-label="Delete"
                  mini
                  onClick={() =>
                    updateQuizElement(o => o.deleteIn(['ui', pos]))
                  }
                >
                  <DeleteIcon />
                  Slet svar
                </Button>
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
            <Image
              url={image}
              style={{borderRadius: 4}}
              height={128}
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
        {(text || image) && (
          <Button
            className={classes.margin}
            onClick={() =>
              updateQuizElement(ui => ui.set('text', '').set('image', ''))
            }
          >
            <DeleteIcon />
            Skjul knap
          </Button>
        )}
        <ImageDialog
          classes={classes}
          imageUrl={image}
          title="Vælg Knap-billede"
          setImageUrl={imageUrl => {
            updateQuizElement(ui => ui.set('image', imageUrl));
          }}
        />
      </div>
    )
  }
};
export default quizElements;
