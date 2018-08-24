import React, {Component} from 'react';
import {connect} from 'react-redux';
import {currentScreen, quizDescription, loading} from '../redux/selectors';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const views = {
  image: ({image}) => <img src={image} />,
  text: ({text}) => text,
  button: ({text}) => (
    <Button variant="contained" color="default">
      {text}
    </Button>
  )
};
function renderElem(o, {pos}) {
  const f = views[o.type];
  return f && <p key={pos}>{f(o)}</p>;
}

export class Widget extends Component {
  render() {
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              {this.props.quizTitle}
            </Typography>
          </Toolbar>
        </AppBar>
        {this.props.ui &&
          this.props.ui.map((o, pos) => renderElem(o.toJS(), {pos}))}
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  const description = quizDescription(state);
  const screen = currentScreen(state);
  return {
    loading: loading(state),
    quizTitle: description.get('title'),
    ui: screen.get('ui')
  };
}

export default connect(mapStateToProps)(Widget);
