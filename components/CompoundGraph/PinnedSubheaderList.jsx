import React from 'react';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

import ListCompound from "./ListCompound";

const styles = theme => ({
  root: {
    margin: '10px',
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 600,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 8,
    borderBottom: 'solid 1px #aaa'
  },
});

const marks = {
  0: '0',
  100: '1',
};


class PinnedSubheaderList extends React.Component{
  
	shouldComponentUpdate(nextProps, nextState) {
		//for(let key in nextProps){
		//  !isEqual(nextProps[key], this.props[key]) && console.log(key, isEqual(nextProps[key], this.props[key]))
		//}
		//console.log(this.props.compounds_checked)
		const propsDiff = isEqual(nextProps, this.props);
		const stateDiff = isEqual(nextState, this.state);
		//console.log("propsDiff", propsDiff)
		//console.log("stateDiff", stateDiff)
		//console.log(!(propsDiff && stateDiff))
		return !(propsDiff && stateDiff);
	}
	
	render () {
    const { classes, compounds, compounds_fractions, compounds_checked, _onchange, _onchangefraction } = this.props;

    return (
      <List className={classes.root} subheader={<li />}>
        {Object.keys(compounds).map((compound, i) => (
          <li key={`section-${compound}`} className={classes.listSection}>
            <ListCompound i={i} classes={classes} compounds={compounds} compound={compound} compounds_fractions={compounds_fractions} compounds_checked={compounds_checked.indexOf(compound)} _onchange={_onchange} _onchangefraction={_onchangefraction} />
          </li>
        ))}
      </List>
    );
  }
}

PinnedSubheaderList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PinnedSubheaderList);
