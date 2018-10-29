import {connect} from 'react-redux';
import React, {Component} from 'react';

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import SearchIcon from '@material-ui/icons/Search';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import style from './style';
import {withStyles} from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import {storageUser, searchResults, searchQuery} from '../redux/selectors';
import {
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
        aria-label="Search"
        onClick={() => this.setState({dialog: true})}
      >
        <DeleteIcon />
      </IconButton>,
      <Dialog
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

export class QuizList extends Component {
  render() {
    const {
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
            variant="outlined"
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
    userName: storageUser(state)
  };
}

export function mapDispatchToProps(dispatch) {
  return {
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
