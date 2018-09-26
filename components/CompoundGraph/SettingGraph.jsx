import React from 'react';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import SettingAxis from './SettingAxis';
import SettingBaseCompound from './SettingBaseCompound';
import ContainedButtons from './ContainedButtons';
import GridPaper from './GridPaper';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class SettingGraph extends React.Component {
  state = {
    yAxis: 'Eg',
    xAxis: "Lattice constant [A]",
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !(isEqual(nextProps, this.props) && isEqual(nextState, this.state));
  }

  yChange = event => {
    this.props._onchangeY(event)
    this.setState({ [event.target.name]: event.target.value });
  };
  xChange = event => {
    this.props._onchangeX(event)
    this.setState({ [event.target.name]: event.target.value });
  };

  render(props) {
    const { classes, compounds, compound_data, xlabels, ylabels, zoomOut, _onchangeLatticeConstant, _onchangeX, _onchangeY } = this.props;
    return (
      <GridPaper xs={2}>
        <form className={classes.root} autoComplete="off" style={{ display: 'flex', flexDirection: 'column' }}>
          <SettingAxis xlabels={xlabels} ylabels={ylabels} _onchangeX={_onchangeX} _onchangeY={_onchangeY} />
          <SettingBaseCompound compounds={compounds} compound_data={compound_data} _onchangeLatticeConstant={_onchangeLatticeConstant} />
          <ContainedButtons zoomOut={zoomOut} />
        </form>
      </GridPaper >
    );
  }
}

SettingGraph.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SettingGraph);
