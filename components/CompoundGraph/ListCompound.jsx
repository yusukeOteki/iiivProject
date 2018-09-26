import React from 'react';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

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


class ListCompound extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
		return !(isEqual(nextProps, this.props) && isEqual(nextState, this.state));
  }

  render() {
    const { classes, i, compounds, compound, compounds_fractions, compounds_checked, _onchange, _onchangefraction } = this.props;

    return (
      <ul className={classes.ul}>
        <ListSubheader>
          <label htmlFor={`check-${compound}`} className={`check-${compound}`}><ListItemText primary={compound} /></label>
          <ListItemSecondaryAction>
            <Switch id={`check-${compound}`} color="primary" value={compound} onChange={_onchange} checked={compounds_checked !== -1} />
          </ListItemSecondaryAction>
        </ListSubheader>
        {(() => {
          if (compounds_fractions.x !== null) {
            return (
              <ListItem key={`list-${i}-x`}>
                <input type="number" className={compound} onChange={_onchangefraction} name="xMin" step={compounds_fractions.x} min="0" max="100" value={compounds_fractions.xMin} />
                <span>&nbsp;≦&nbsp;{compounds[compound].x}&nbsp;≦&nbsp;</span>
                <input type="number" className={compound} onChange={_onchangefraction} name="xMax" step={compounds_fractions.x} min="0" max="100" value={compounds_fractions.xMax} />
                &nbsp;step
                      <select name='x' className={compound} onChange={_onchangefraction}>
                  <option value="10">10</option>
                  <option value="1">1</option>
                </select>
              </ListItem>
            )
          }
        })()}
        {(() => {
          if (compounds_fractions.x !== null) {
            return (
              <Range key={`list-${i}-rx`}
                min={0} max={100} value={[compounds_fractions.xMin, compounds_fractions.xMax]} step={compounds_fractions.x}
                disabled={compounds_checked + 1 ? (false) : (true)}
                onChange={e => _onchangefraction(e, compound, 'x')}
              />
            )
          }
        })()}
        {(() => {
          if (compounds_fractions.y !== null) {
            return (
              <ListItem key={`list-${i}-y`}>
                <input type="number" className={compound} onChange={_onchangefraction} name="yMin" step={compounds_fractions.y} min="0" max="100" value={compounds_fractions.yMin} />
                <span>&nbsp;≦&nbsp;{compounds[compound].y}&nbsp;≦&nbsp;</span>
                <input type="number" className={compound} onChange={_onchangefraction} name="yMax" step={compounds_fractions.y} min="0" max="100" value={compounds_fractions.yMax} />
                &nbsp;step
                      <select name='y' className={compound} onChange={_onchangefraction}>
                  <option value="10">10</option>
                  <option value="1">1</option>
                </select>
              </ListItem>
            )
          }
        })()}
        {(() => {
          if (compounds_fractions.y !== null) {
            return (
              <Range key={`list-${i}-ry`}
                min={0} max={100} value={[compounds_fractions.yMin, compounds_fractions.yMax]} step={compounds_fractions.y}
                disabled={compounds_checked + 1 ? (false) : (true)}
                onChange={e => _onchangefraction(e, compound, 'y')}
              />
            )
          }
        })()}
      </ul>
    );
  }
}

ListCompound.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListCompound);
