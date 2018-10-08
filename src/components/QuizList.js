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

import {searchResults, searchQuery} from '../redux/selectors';
import {
  addQuiz,
  setQuiz,
  deleteQuiz,
  changeSearchQuery,
  toggleSearchOwnOnly
} from '../redux/actions';

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
            {searchResults.map(o => (
              <ListItem key={o.get('_id')} button onClick={() => setQuiz(o)}>
                <ListItemText>
                  <strong className={classes.margin}>{o.get('title')}</strong>
                  {o.get('tags', []).map(tag => (
                    <span key={tag} className={classes.margin}>
                      {tag}
                    </span>
                  ))}
                  <br />
                  <small className={classes.margin}>
                    {o.get('_version')} {o.get('_owner')}
                  </small>
                </ListItemText>
                <ListItemSecondaryAction>
                  <IconButton aria-label="Copy" onClick={copy(o)}>
                    <FileCopyIcon />
                  </IconButton>
                  <IconButton
                    aria-label="Search"
                    onClick={() => deleteQuiz(o.get('_id'))}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  return {searchResults: searchResults(state), ...searchQuery(state)};
}

export function mapDispatchToProps(dispatch) {
  return {
    setQuiz: quiz => dispatch(setQuiz(quiz)),
    deleteQuiz: quiz => dispatch(deleteQuiz(quiz)),
    newQuiz: () => dispatch(addQuiz),
    doSearch: () => {},
    copy: () => {},
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
