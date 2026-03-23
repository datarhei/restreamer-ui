import React from 'react';

import { Trans } from '@lingui/macro';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';

import Checkbox from '../Checkbox';
import UploadButton from '../UploadButton';

function init(initial) {
  if (Array.isArray(initial)) {
    return initial.map((o) => ({
      path: '',
      width: '',
      height: '',
      x: '',
      y: '',
      framerate: 30,
      loop: true,
      order: 0,
      ...o,
    }));
  }
  return [];
}

export default function Overlays(props) {
  const [items, setItems] = React.useState(init(props.settings));

  // Set defaults on mount
  React.useEffect(() => {
    props.onChange(items, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptTypes = [
    { mimetype: 'image/png', extension: 'png', maxSize: 20 * 1024 * 1024 },
    { mimetype: 'image/jpeg', extension: 'jpg', maxSize: 20 * 1024 * 1024 },
    { mimetype: 'image/webp', extension: 'webp', maxSize: 20 * 1024 * 1024 },
    { mimetype: 'image/gif', extension: 'gif', maxSize: 20 * 1024 * 1024 },
  ];

  const update = (next) => {
    setItems(next);
    props.onChange(next, false);
  };

  const addOverlay = () => {
    const next = items.slice();
    next.push({ path: '', width: '', height: '', x: '', y: '', framerate: 30, loop: true, order: next.length });
    update(next);
  };

  const removeOverlay = (idx) => () => {
    const next = items.filter((_, i) => i !== idx).map((o, i) => ({ ...o, order: i }));
    update(next);
  };

  const moveOverlay = (idx, dir) => () => {
    const next = items.slice();
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    const tmp = next[idx];
    next[idx] = next[j];
    next[j] = tmp;
    next.forEach((o, i) => (o.order = i));
    update(next);
  };

  const handleField = (idx, field) => (event) => {
    const value = event?.target?.type === 'checkbox' ? event.target.checked : event.target.value;
    const next = items.slice();
    next[idx] = { ...next[idx], [field]: value };
    update(next);
  };

  const handleUploadStart = () => {};
  const handleUploadError = () => {};

  const handleUpload = (idx) => async (data, extension /*, mimetype */) => {
    try {
      if (props.restreamer) {
        const name = `overlay_${Date.now()}.${extension}`;
        const path = await props.restreamer.UploadData(props.channelid || '', name, data);
        const newPath = "/core/data" + path;
        console.log('path', newPath);
        const next = items.slice();
        next[idx] = { ...next[idx], path: newPath };
        update(next);
      }
    } catch (e) {
      // swallow
      // Optionally, you can integrate NotifyContext in parent to surface errors
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3">
          <Trans>Overlays</Trans>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2">
          <Trans>Upload images and position them on the video. Order defines layering from bottom to top.</Trans>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="outlined" color="primary" onClick={addOverlay}>
          <Trans>Add overlay</Trans>
        </Button>
      </Grid>

      {items.map((ov, idx) => (
        <React.Fragment key={`overlay-${idx}`}>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h4">
                <Trans>Overlay #{idx + 1}</Trans>
              </Typography>
              <Box>
                <IconButton aria-label="move up" onClick={moveOverlay(idx, -1)} size="large">
                  <ArrowUpwardIcon />
                </IconButton>
                <IconButton aria-label="move down" onClick={moveOverlay(idx, +1)} size="large">
                  <ArrowDownwardIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={removeOverlay(idx)} size="large">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <UploadButton
              label={<Trans>Upload image</Trans>}
              acceptTypes={acceptTypes}
              onStart={handleUploadStart}
              onError={handleUploadError}
              onUpload={handleUpload(idx)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              fullWidth
              label={<Trans>Path</Trans>}
              value={ov.path}
              onChange={handleField(idx, 'path')}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              variant="outlined"
              fullWidth
              label={<Trans>Width (-1 keep)</Trans>}
              value={ov.width}
              onChange={handleField(idx, 'width')}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              variant="outlined"
              fullWidth
              label={<Trans>Height (-1 keep)</Trans>}
              value={ov.height}
              onChange={handleField(idx, 'height')}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField variant="outlined" fullWidth label={<Trans>X</Trans>} value={ov.x} onChange={handleField(idx, 'x')} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField variant="outlined" fullWidth label={<Trans>Y</Trans>} value={ov.y} onChange={handleField(idx, 'y')} />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              variant="outlined"
              fullWidth
              label={<Trans>Framerate</Trans>}
              value={ov.framerate}
              onChange={handleField(idx, 'framerate')}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Checkbox label={<Trans>Loop</Trans>} checked={!!ov.loop} onChange={handleField(idx, 'loop')} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              variant="outlined"
              fullWidth
              label={<Trans>Order</Trans>}
              value={ov.order}
              onChange={handleField(idx, 'order')}
            />
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
}

Overlays.defaultProps = {
  settings: [],
  onChange: function (settings, automatic) {},
  restreamer: null,
  channelid: '',
};
