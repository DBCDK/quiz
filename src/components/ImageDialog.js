import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {storage, getUser} from '../redux/openplatform';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import quizElements from './quizElements';

export default class ImageDialog extends React.Component {
  state = {
    open: false,
    loading: false
  };
  async openDialog() {
    this.setState({open: true, loading: true});
    let result = await storage.scan({
      reverse: true,
      _type: 'openplatform.quizImage',
      index: ['_owner', '_version'],
      startsWith: [await getUser()]
    });
    this.setState({loading: false, images: result.map(o => o.val)});
  }
  chooseImage(id) {
    this.props.setImageUrl('openplatform:' + id);
    this.setState({open: false});
  }
  render() {
    if (!this.state.open) {
      return <Button onClick={() => this.openDialog()}>Vælg billede</Button>;
    }
    return (
      <Dialog open={true} onClose={() => this.setState({open: false})}>
        <input
          accept="image/jpeg"
          className={(this.props.classes || {}).displayNone}
          id="uploadImageFile"
          type="file"
          onChange={async e => {
            try {
              this.setState({open: true, loading: true});
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
              this.chooseImage(_id);
            } catch (e) {
              // TODO show error
            }
          }}
        />
        <DialogContent>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Typography variant="title">
                <span style={{float: 'right', marginTop: 16}}>
                  <Button onClick={() => this.setState({open: false})}>
                    <CloseIcon />
                  </Button>
                </span>
                <br />
                Vælg billede
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {quizElements.media.view(
                {url: this.props.imageUrl},
                {classes: this.props.classes, width: 120}
              )}
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="Url for billede eller youtube/vimeo-video"
                value={this.props.imageUrl}
                onChange={e => this.props.setImageUrl(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <label htmlFor="uploadImageFile">
                <Button component="span">
                  <AddIcon /> Upload billede
                </Button>
              </label>
            </Grid>
            <Grid item xs={12} />
            {this.state.loading ? (
              <center>
                <CircularProgress />
              </center>
            ) : (
              // TODO: use style class instead of inline styling
              <div style={{textAlign: 'justify'}}>
                <Typography>Mine billeder:</Typography>
                {this.state.images.map(uuid => [
                  <img
                    onClick={() => this.chooseImage(uuid)}
                    style={{marginBottom: 8}}
                    src={
                      'https://openplatform.dbc.dk/v3/storage/' +
                      uuid +
                      '?height=80'
                    }
                  />,
                  ' '
                ])}
              </div>
            )}
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
}
