import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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

class SettingAxis extends React.Component {
  state = {
    yAxis: 'Eg',
    xAxis: "Lattice constant [A]",
  };

  yChange = event => {
    this.props._onchangeY(event)
    this.setState({ [event.target.name]: event.target.value });
  };
  xChange = event => {
    this.props._onchangeX(event)
    this.setState({ [event.target.name]: event.target.value });
  };

  render(props) {
    const { classes, xlabels, ylabels } = this.props;
    return ([
        <FormControl key={`ylabel`} className={classes.formControl}>
          <InputLabel htmlFor="yAxis">Y Axis</InputLabel>
          <Select name="band" value={this.state.yAxis} onChange={this.yChange} inputProps={{ name: 'yAxis', id: 'yAxis' }} >
            {ylabels.map((label,i) =>
              <MenuItem key={`ylabel-${i}`} value={label}>{label}</MenuItem>
            )}
          </Select>
        </FormControl>,
        <FormControl key={`xlabel`} className={classes.formControl}>
          <InputLabel htmlFor="xAxis">X Axis</InputLabel>
          <Select name="band" value={this.state.xAxis} onChange={this.xChange} inputProps={{ name: 'xAxis', id: 'xAxis', }} >
            {xlabels.map((label,i) =>
              <MenuItem key={`xlabel-${i}`} value={label}>{label}</MenuItem>
            )}
          </Select>
        </FormControl>
    ]);
  }
}

SettingAxis.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SettingAxis);
