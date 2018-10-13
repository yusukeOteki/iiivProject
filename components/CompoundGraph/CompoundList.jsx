/*jshint esversion: 6 */
import React from 'react';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import 'rc-slider/assets/index.css';
import { GridPaper, CompoundItem, compounds } from '.';

const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 700,
  },
});

class CompoundLists extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(isEqual(nextProps, this.props) && isEqual(nextState, this.state));
  }

  render() {
    const { classes, compounds_fractions, compounds_checked, _onchangeY, _onchange, _onchangefraction } = this.props;

    return (
      <GridPaper xs={12}>
        <List className={classes.root} subheader={<li />}>
          {Object.keys(compounds).map((compound, i) =>
            <CompoundItem key={`section-${compound}`} i={i} classes={classes} compounds={compounds} compound={compound} compounds_fractions={compounds_fractions[compound]} compounds_checked={compounds_checked.indexOf(compound)} _onchange={_onchange} _onchangefraction={_onchangefraction} />
          )}
        </List>
      </GridPaper>
    )
  }
}

CompoundLists.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CompoundLists);