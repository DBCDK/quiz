import {connect} from 'react-redux';
import React, {Component} from 'react';
import _ from 'lodash';
import Immutable from 'immutable';

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import BarChartIcon from '@material-ui/icons/BarChart';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import SearchIcon from '@material-ui/icons/Search';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import style from './style';
import {withStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import {
  statistics,
  storageUser,
  searchResults,
  searchQuery,
  quizQuestionList
} from '../redux/selectors';
import {
  showStatistics,
  hideStatistics,
  addQuiz,
  setQuiz,
  deleteQuiz,
  changeSearchQuery,
  toggleSearchOwnOnly
} from '../redux/actions';

class DeleteButton extends Component {
  constructor() {
    super();
    this.state = {dialog: false};
  }
  render() {
    return [
      <IconButton
        key="button"
        aria-label="Search"
        onClick={() => this.setState({dialog: true})}
      >
        <DeleteIcon />
      </IconButton>,
      <Dialog
        key="dialog"
        open={this.state.dialog}
        onClose={() => this.setState({dialog: false})}
      >
        <DialogTitle>Vil du slette quiz'en?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              Hvis quiz'en slettes, så vil det ikke længere være muligt at tage
              den.
            </p>
            <p>Slettede quiz'er kan ikke gendannes. </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.setState({dialog: false})}>Nej</Button>
          <Button
            onClick={() => {
              this.props.deleteQuiz(this.props.quizId);
              this.setState({dialog: false});
            }}
            color="primary"
          >
            Ja
          </Button>
        </DialogActions>
      </Dialog>
    ];
  }
}

class StatisticsDialog extends Component {
  render() {
    let {quiz, hideStatistics, screenHits, agencyHits, dayHits} = this.props;
    quiz = Immutable.fromJS(quiz);
    const questions = quizQuestionList(quiz);
    const screenStat = {};
    Object.keys(screenHits).forEach(screenId => {
      const parent = quiz.getIn(['screens', screenId, 'parent'], screenId);
      screenStat[parent] = screenStat[parent] || [];
      screenStat[parent].push([screenId, screenHits[screenId]]);
    });
    function screenTitle(screen) {
      let title = '';
      screen.get('ui', []).forEach(ui => !title && (title = ui.get('text')));
      return screen.get('dispatch') ? 'Quiz-afslutninger:' : title;
    }

    const maxDay = Math.max.apply(Math, Object.values(dayHits)) || 1;
    return (
      <Dialog onClose={hideStatistics} open={true}>
        <DialogTitle>
          Statistik for quiz'en: <small>{quiz.get('title')}</small>
        </DialogTitle>
        <DialogContent>
          <Typography>
            <strong>Svar-statistik:</strong>
            <br />
            {Object.keys(dayHits).length === 0 ? (
              <center>
                <CircularProgress />
              </center>
            ) : (
              questions.map(questionId => {
                const question = quiz.getIn(['screens', questionId]);
                {
                  JSON.stringify(
                    (question.get('ui') || Immutable.List()).filter(
                      o => o.get('type') === 'buttonGroup'
                    )
                  );
                }
                let results = question.get('ui');
                results =
                  results &&
                  results.filter(o => o.get('type') === 'buttonGroup').first();
                results =
                  results &&
                  results.get('ui').map(o => o.getIn(['action', 'screen']));

                results =
                  results ||
                  (question.get('dispatch') &&
                    question
                      .get('dispatch')
                      .map(o => o.getIn(['action', 'screen'])));

                return (
                  <p key={questionId}>
                    {screenHits[questionId] && (
                      <strong>{screenHits[questionId] || 0}× </strong>
                    )}{' '}
                    {screenTitle(question)}
                    <ul>
                      {results &&
                        results.map(screenId => (
                          <li>
                            <strong>{screenHits[screenId] || 0}× </strong>
                            {screenTitle(quiz.getIn(['screens', screenId]))}
                          </li>
                        ))}
                    </ul>
                  </p>
                );
              })
            )}
            <div />
            <br />
            <strong>Quiz-visninger:</strong> <br />
            {Object.keys(dayHits).length === 0 ? (
              <center>
                <CircularProgress />
              </center>
            ) : (
              Object.keys(dayHits)
                .sort()
                .reverse()
                .map(date => (
                  <small key={date}>
                    {' '}
                    {date}:{' '}
                    <span
                      style={{
                        display: 'inline-block',
                        width: (dayHits[date] / maxDay) * 60 + '%',
                        background: 'rgba(0,0,255,.3)',
                        margin: '1px'
                      }}
                    >
                      &nbsp;
                      {dayHits[date]}
                    </span>
                    <br />
                  </small>
                ))
            )}
          </Typography>
          {Object.keys(agencyHits).length > 0 && (
            <Typography>
              <strong>Totalt antal hits per agency:</strong> <br />
              {Object.keys(agencyHits)
                .sort()
                .reverse()
                .map(agency => (
                  <small key={agency}>
                    {' '}
                    {agency}: &nbsp;
                    {agencyHits[agency]}
                    <br />
                  </small>
                ))}
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    );
  }
}

export class QuizList extends Component {
  render() {
    const {
      showStatistics,
      hideStatistics,
      statistics,
      deleteQuiz,
      classes,
      searchResults,
      newQuiz,
      setQuiz,
      query,
      changeQuery,
      ownOnly,
      toggleOwnOnly,
      doSearch,
      userName,
      copy
    } = this.props;
    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Button onClick={newQuiz}>
            <AddIcon /> Ny Quiz{' '}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Find quiz"
            value={query}
            onChange={e => changeQuery(e.target.value)}
            InputProps={{
              labelWidth: 64,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="Search" onClick={doSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <div>
            <FormControlLabel
              control={<Switch checked={ownOnly} onChange={toggleOwnOnly} />}
              label="Kun egne quizzer"
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          {statistics && (
            <StatisticsDialog
              quiz={statistics.quiz}
              dayHits={statistics.dayHits}
              screenHits={statistics.screenHits}
              agencyHits={statistics.agencyHits}
              hideStatistics={hideStatistics}
            />
          )}
          <List>
            {searchResults.map(o => {
              const isOwn = o.get('_owner') === userName;
              return (
                <ListItem
                  key={o.get('_id')}
                  button
                  onClick={() =>
                    isOwn
                      ? setQuiz(o)
                      : window.open(
                          'https://quiz.dbc.dk/widget?' + o.get('_id')
                        )
                  }
                >
                  <ListItemText>
                    {isOwn ? (
                      <strong className={classes.margin}>
                        {o.get('title')}
                      </strong>
                    ) : (
                      <span className={classes.margin}>{o.get('title')}</span>
                    )}
                    {o.get('tags', []).map(tag => (
                      <small key={tag} className={classes.margin}>
                        {isOwn ? tag : <small>{tag}</small>}
                      </small>
                    ))}
                    <br />
                    <small className={classes.margin}>
                      {o.get('_version')} {o.get('_owner')}
                    </small>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    {isOwn && (
                      <DeleteButton
                        deleteQuiz={deleteQuiz}
                        quizId={o.get('_id')}
                      />
                    )}
                    <IconButton aria-label="Copy" onClick={() => copy(o)}>
                      <FileCopyIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Statistics"
                      onClick={() => showStatistics(o)}
                    >
                      <BarChartIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Grid>
      </Grid>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  return {
    searchResults: searchResults(state),
    ...searchQuery(state),
    userName: storageUser(state),
    statistics: statistics(state)
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    showStatistics: quiz => dispatch(showStatistics(quiz)),
    hideStatistics: () => dispatch(hideStatistics()),
    setQuiz: quiz => dispatch(setQuiz(quiz)),
    deleteQuiz: quiz => dispatch(deleteQuiz(quiz)),
    newQuiz: () => dispatch(addQuiz()),
    doSearch: () => {},
    copy: quiz =>
      dispatch(
        addQuiz(
          quiz
            .delete('_id')
            .delete('_version')
            .delete('_owner')
        )
      ),
    toggleOwnOnly: () => dispatch(toggleSearchOwnOnly()),
    changeQuery: q => dispatch(changeSearchQuery(q))
  };
}

export default withStyles(style)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(QuizList)
);
