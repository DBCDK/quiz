const style = theme => ({
  container: {
    maxWidth: Math.min(window.innerWidth * 0.95, 960),
    minHeight: window.innerHeight - 64,
    textAlign: 'left'
  },
  maxImageSize: {
    maxWidth: 0.8 * Math.min(window.innerWidth * 0.95, 960),
    maxHeight: 0.6 * window.innerHeight
  },
  button: {
    overflow: 'hidden',
    height: 36
  },
  margin: {
    margin: 8
  },
  input: {
    display: 'none'
  }
});
export default style;
