import React from 'react';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import 'rc-slider/assets/index.css';

import ListCompound from "./ListCompound";

const styles = theme => ({
  root: {
    margin: '10px',
    padding: '10px',
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 600,
  },
});

class PinnedSubheaderList extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(isEqual(nextProps, this.props) && isEqual(nextState, this.state));
  }

  render() {
    const { classes, compounds, compounds_fractions, compounds_checked, _onchange, _onchangefraction } = this.props;

    return (
      <List className={classes.root} subheader={<li />}>
        {Object.keys(compounds).map((compound, i) =>
          <ListCompound key={`section-${compound}`} i={i} classes={classes} compounds={compounds} compound={compound} compounds_fractions={compounds_fractions[compound]} compounds_checked={compounds_checked.indexOf(compound)} _onchange={_onchange} _onchangefraction={_onchangefraction} />
        )}
      </List>
    );
  }
}

PinnedSubheaderList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PinnedSubheaderList);
