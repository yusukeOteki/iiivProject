import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

class SettingBaseCompound extends React.Component {
  state = {
    open: false,
    compound: 'GaAs',
    xFraction: 101,
    yFraction: 101,
    latticeConstant: this.props.compound_data['GaAs'][0].a,
    latex : this.props.compound_data['GaAs'][0].latex,
    pre_compound: 'GaAs',
    pre_xFraction: 101,
    pre_yFraction: 101,
    pre_latex: this.props.compound_data['GaAs'][0].a,
    pre_latticeConstant: this.props.compound_data['GaAs'][0].latex
  };

  handleChange = event => {
    let temp_xFraction = this.props.compounds[event.target.value].x ? 0 : 101
    let temp_yFraction = this.props.compounds[event.target.value].y ? 0 : 101
    let BaseCompound = this.setCompound(event.target.value, temp_xFraction, temp_yFraction);
    this.setState({
      pre_compound: event.target.value,
      pre_xFraction: temp_xFraction,
      pre_yFraction: temp_yFraction,
      pre_latex: BaseCompound.latex,
      pre_latticeConstant: BaseCompound.a
    });
  };

  setCompound = (compound, xFraction, yFraction) => {
    let BaseCompound = {}
    this.props.compound_data[compound].map(raw =>{
      if(xFraction===101 ||(raw.x === xFraction && (yFraction===101 || raw.y===yFraction))){
        BaseCompound.latex = raw.latex
        BaseCompound.a = raw.a
      }
    })
    return BaseCompound;
  }

  xChange = event => {
    let temp_xFraction = Number(event.target.value)
    let BaseCompound = this.setCompound(this.state.pre_compound, temp_xFraction, this.state.pre_yFraction);
    this.setState({
      pre_xFraction: temp_xFraction,
      pre_latex: BaseCompound.latex,
      pre_latticeConstant: BaseCompound.a
    });
  };

  yChange = event => {
    let temp_yFraction = Number(event.target.value)
    let BaseCompound = this.setCompound(this.state.pre_compound, this.state.pre_xFraction, temp_yFraction);
    this.setState({
      pre_yFraction: temp_yFraction,
      pre_latex: BaseCompound.latex,
      pre_latticeConstant: BaseCompound.a
    });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props._onchangeLatticeConstant(this.state.pre_latticeConstant)
    this.setState({
      compound: this.state.pre_compound,
      xFraction: this.state.pre_xFraction,
      yFraction: this.state.pre_yFraction,
      latex: this.state.pre_latex,
      latticeConstant: this.state.pre_latticeConstant,
      open: false
    });
  };

  handleCancel = () => {
    this.setState({
      pre_compound: this.state.compound,
      pre_xFraction: this.state.xFraction,
      pre_yFraction: this.state.yFraction,
      pre_latex: this.state.latex,
      pre_latticeConstant: this.state.latticeConstant,
      open: false
    });
  };

  render(props) {
    const { classes, compounds, compound_data } = this.props;

    return (
      <div>
      <FormControl className={classes.formControl}>
        <Button variant="contained" style={{"textTransform": 'none'}} onClick={this.handleClickOpen}>
          Base Compound: {this.state.compound}
        </Button>
      </FormControl>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.open}
        >
          <DialogTitle>Select the Compound</DialogTitle>
          <DialogContent>
            <form className={classes.container}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="compound">Compound</InputLabel>
                <Select
                  value={this.state.pre_compound}
                  onChange={this.handleChange}
                  input={<Input id="compound" />}
                >
                  {Object.keys(compounds).map((compound,i) =>
                    <MenuItem key={`compound-${i}`} value={compound}>{compound}</MenuItem>
                  )}
                </Select>
              </FormControl>
              {this.state.pre_xFraction>100 ? '' :
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="xFraction">x fraction</InputLabel>
                  <Select
                    value={this.state.pre_xFraction}
                    onChange={this.xChange}
                    input={<Input id="xFraction" />}
                  >
                  {
                    (() => {
                      let list = []
                      for(let x=0; x<101; x++){
                         list.push(<MenuItem key={`compound-${x}`} value={x}>{x}</MenuItem>)
                      }
                      return list;
                    })()
                  }
                  </Select>
                </FormControl>
              }
              {this.state.pre_yFraction>100 ? '' :
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="yFraction">y fraction</InputLabel>
                  <Select
                    value={this.state.pre_yFraction}
                    onChange={this.yChange}
                    input={<Input id="yFraction" />}
                  >
                  {
                    (() => {
                      let list = []
                      for(let y=0; y<101; y++){
                         list.push(<MenuItem key={`compound-${y}`} value={y}>{y}</MenuItem>)
                      }
                      return list;
                    })()
                  }
                  </Select>
                </FormControl>
              }
            </form>
            <div>
              <div>
                <p>Compound: {this.state.pre_latex}</p>
                <p>Lattice Constant: {this.state.pre_latticeConstant} A</p>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Ok
            </Button>
            <Button onClick={this.handleCancel} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

SettingBaseCompound.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SettingBaseCompound);
