const style = theme => ({
  displayNone: {
    display: 'none'
  },
  container: {
    maxWidth: Math.min(window.innerWidth * 0.95, 960),
    textAlign: 'left'
  },
  containerSpacing: {
    maxWidth: Math.min(window.innerWidth * 0.95, 960),
    minHeight: window.innerHeight - 64,
    textAlign: 'left'
  },
  maxImageSize: {
    maxWidth: 0.8 * Math.min(window.innerWidth * 0.95, 960),
    maxHeight: 0.5 * window.innerHeight
  },
  button: {
    overflow: 'hidden',
    height: 36
  },
  margin: {
    margin: 8
  },
  paper: {
    marginTop: 8,
    marginBottom: 8,
    padding: 16
  },
  input: {
    display: 'none'
  }
});
export default style;
