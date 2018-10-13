import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
});

function ZoomOutButton(props) {
  const { classes, zoomOut } = props;
  return (
    <div>
      <Button variant="contained" style={{"textTransform": 'none'}} className={classes.button} onClick={zoomOut}>
        Zoom Out
      </Button>
    </div>
  );
}

ZoomOutButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ZoomOutButton);
