import React from 'react';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import 'rc-slider/assets/index.css';

const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 700,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 8,
    borderBottom: 'solid 1px #aaa',
  },
});

class Filter extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(isEqual(nextProps, this.props) && isEqual(nextState, this.state));
  }

  render() {
    const { classes, filter, onChamgeFilter } = this.props;

    return (
      <List className={classes.root} subheader={<li />}>
        <ul className={classes.ul}>
          <ListSubheader>
            <input type="number" className={`a`} onChange={(e) => onChamgeFilter(e, 'a_min')} name="aMin" step={0.01} min={filter.a_min.init} max={filter.a_max.init} value={filter.a_min.value} />
            <span>&nbsp;≦&nbsp;{`a`}&nbsp;≦&nbsp;</span>
            <input type="number" className={`a`} onChange={(e) => onChamgeFilter(e, 'a_max')} name="aMax" step={0.01} min={filter.a_min.init} max={filter.a_max.init} value={filter.a_max.value} />
            <ListItemSecondaryAction>
              <Switch id={`a`} color="primary" value={"a"} onChange={(e) => onChamgeFilter(e, 'a_on')} checked={filter.a_min.on} />
            </ListItemSecondaryAction>
          </ListSubheader>
        </ul>
        <ul className={classes.ul}>
          <ListSubheader>
            <input type="number" className={`Eg`} onChange={(e) => onChamgeFilter(e, 'Eg_min')} name="EgMin" step={0.01} min={filter.Eg_min.init} max={filter.Eg_max.init} value={filter.Eg_min.value} />
            <span>&nbsp;≦&nbsp;{`Eg`}&nbsp;≦&nbsp;</span>
            <input type="number" className={`Eg`} onChange={(e) => onChamgeFilter(e, 'Eg_max')} name="EgMax" step={0.01} min={filter.Eg_min.init} max={filter.Eg_max.init} value={filter.Eg_max.value} />
            <ListItemSecondaryAction>
              <Switch id={`Eg`} color="primary" value={"Eg"} onChange={(e) => onChamgeFilter(e, 'Eg_on')} checked={filter.Eg_min.on} />
            </ListItemSecondaryAction>
          </ListSubheader>
        </ul>
        <ul className={classes.ul}>
          <ListSubheader>
            <input type="number" className={`CB`} onChange={(e) => onChamgeFilter(e, 'CB_min')} name="CBMin" step={0.01} min={filter.CB_min.init} max={filter.CB_max.init} value={filter.CB_min.value} />
            <span>&nbsp;≦&nbsp;{`CB`}&nbsp;≦&nbsp;</span>
            <input type="number" className={`CB`} onChange={(e) => onChamgeFilter(e, 'CB_max')} name="CBMax" step={0.01} min={filter.CB_min.init} max={filter.CB_max.init} value={filter.CB_max.value} />
            <ListItemSecondaryAction>
              <Switch id={`CB`} color="primary" value={"CB"} onChange={(e) => onChamgeFilter(e, 'CB_on')} checked={filter.CB_min.on} />
            </ListItemSecondaryAction>
          </ListSubheader>
        </ul>
        <ul className={classes.ul}>
          <ListSubheader>
            <input type="number" className={`VB`} onChange={(e) => onChamgeFilter(e, 'VB_min')} name="VBMin" step={0.01} min={filter.VB_min.init} max={filter.VB_max.init} value={filter.VB_min.value} />
            <span>&nbsp;≦&nbsp;{`VB`}&nbsp;≦&nbsp;</span>
            <input type="number" className={`VB`} onChange={(e) => onChamgeFilter(e, 'VB_max')} name="VBMax" step={0.01} min={filter.VB_min.init} max={filter.VB_max.init} value={filter.VB_max.value} />
            <ListItemSecondaryAction>
              <Switch id={`VB`} color="primary" value={"VB"} onChange={(e) => onChamgeFilter(e, 'VB_on')} checked={filter.VB_min.on} />
            </ListItemSecondaryAction>
          </ListSubheader>
        </ul>
        <ul className={classes.ul}>
          <ListSubheader>
            <ListItemText primary={`direct only`} />
            <ListItemSecondaryAction>
              <Switch id={`direct`} color="primary" value={"direct"} onChange={(e) => onChamgeFilter(e, 'direct')} checked={filter.direct_only.on} />
            </ListItemSecondaryAction>
          </ListSubheader>
        </ul>
        <ul className={classes.ul}>
          <ListSubheader>
            <ListItemText primary={`indirect only`} />
            <ListItemSecondaryAction>
              <Switch id={`indirect`} color="primary" value={"indirect"} onChange={(e) => onChamgeFilter(e, 'indirect')} checked={filter.indirect_only.on} />
            </ListItemSecondaryAction>
          </ListSubheader>
        </ul>
      </List>
    );
  }
}

Filter.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Filter);
