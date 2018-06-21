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
    latex : this.props.compound_data['GaAs'][0].latex
  };

  handleChange = event => {
    let temp_xFraction = this.props.compounds[event.target.value].x ? 0 : 101
    let temp_yFraction = this.props.compounds[event.target.value].y ? 0 : 101
    let BaseCompound = this.setCompound(event.target.value, temp_xFraction, temp_yFraction);
    this.setState({
      compound: event.target.value,
      xFraction: temp_xFraction,
      yFraction: temp_yFraction,
      latex: BaseCompound.latex,
      latticeConstant: BaseCompound.a
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
    let BaseCompound = this.setCompound(this.state.compound, temp_xFraction, this.state.yFraction);
    this.setState({
      xFraction: temp_xFraction,
      latex: BaseCompound.latex,
      latticeConstant: BaseCompound.a
    });
  };

  yChange = event => {
    let temp_yFraction = Number(event.target.value)
    let BaseCompound = this.setCompound(this.state.compound, this.state.xFraction, temp_yFraction);
    this.setState({
      yFraction: temp_yFraction,
      latex: BaseCompound.latex,
      latticeConstant: BaseCompound.a
    });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props._onchangeLatticeConstant(this.state.latticeConstant)
    this.setState({ open: false });
  };

  render(props) {
    const { classes, compounds, compound_data } = this.props;

    return (
      <div>
        <Button style={{"textTransform": 'none'}} onClick={this.handleClickOpen}>
          Base Compound: {this.state.compound}
        </Button>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.open}
          onClose={this.handleClose}
        >
          <DialogTitle>Select the Compound</DialogTitle>
          <DialogContent>
            <form className={classes.container}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="compound">Compound</InputLabel>
                <Select
                  value={this.state.compound}
                  onChange={this.handleChange}
                  input={<Input id="compound" />}
                >
                  {Object.keys(compounds).map((compound,i) =>
                    <MenuItem key={`compound-${i}`} value={compound}>{compound}</MenuItem>
                  )}
                </Select>
              </FormControl>
              {this.state.xFraction>100 ? '' :
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="xFraction">x fraction</InputLabel>
                  <Select
                    value={this.state.xFraction}
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
              {this.state.yFraction>100 ? '' :
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="yFraction">y fraction</InputLabel>
                  <Select
                    value={this.state.yFraction}
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
                <p>Compound: {this.state.latex}</p>
                <p>Lattice Constant: {this.state.latticeConstant} A</p>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Ok
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
