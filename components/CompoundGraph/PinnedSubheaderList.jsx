import React from 'react';
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
function PinnedSubheaderList(props) {
  const { classes, compounds, compounds_fractions, compounds_checked, _onchange, _onchangefraction } = props;

  return (
    <List className={classes.root} subheader={<li />}>
      {Object.keys(compounds).map((compound, i) => (
        <li key={`section-${compound}`} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader>
              <label htmlFor={`check-${compound}`} className={`check-${compound}`}><ListItemText primary={compound} /></label>
              <ListItemSecondaryAction>
                <Switch id={`check-${compound}`} color="primary" value={compound} onChange={_onchange} checked={compounds_checked.indexOf(compound) !== -1} />
              </ListItemSecondaryAction>
            </ListSubheader>
            {(() => {
              if(compounds_fractions[compound].x !== null){
                return (
                  <ListItem key={`list-${i}-x`}>
                    <input type="number" className={compound} onChange={_onchangefraction} name="xMin" step={compounds_fractions[compound].x} min="0" max="100" value={compounds_fractions[compound].xMin} />
                    <span>&nbsp;≦&nbsp;{compounds[compound].x}&nbsp;≦&nbsp;</span>
                    <input type="number" className={compound} onChange={_onchangefraction} name="xMax" step={compounds_fractions[compound].x} min="0" max="100" value={compounds_fractions[compound].xMax} />
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
              if(compounds_fractions[compound].x !== null){
                return (
                  <Range key={`list-${i}-rx`}
                    min={0} max={100} value={[compounds_fractions[compound].xMin, compounds_fractions[compound].xMax]} step={compounds_fractions[compound].x}
                    disabled={compounds_checked.indexOf(compound)+1 ? (false) : (true)}
                    onChange={e =>_onchangefraction(e, compound, 'x')}
                  />
                )
              }
            })()}
            {(() => {
              if(compounds_fractions[compound].y !== null){
                return (
                <ListItem key={`list-${i}-y`}>
                    <input type="number" className={compound} onChange={_onchangefraction} name="yMin" step={compounds_fractions[compound].y} min="0" max="100" value={compounds_fractions[compound].yMin} />
                    <span>&nbsp;≦&nbsp;{compounds[compound].y}&nbsp;≦&nbsp;</span>
                    <input type="number" className={compound} onChange={_onchangefraction} name="yMax" step={compounds_fractions[compound].y} min="0" max="100" value={compounds_fractions[compound].yMax} />
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
              if(compounds_fractions[compound].y !== null){
                return (
                  <Range key={`list-${i}-ry`}
                    min={0} max={100} value={[compounds_fractions[compound].yMin, compounds_fractions[compound].yMax]} step={compounds_fractions[compound].y}
                    disabled={compounds_checked.indexOf(compound)+1 ? (false) : (true)}
                    onChange={e =>_onchangefraction(e, compound, 'y')}
                  />
                )
              }
            })()}
          </ul>
        </li>
      ))}
    </List>
  );
}

PinnedSubheaderList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PinnedSubheaderList);
