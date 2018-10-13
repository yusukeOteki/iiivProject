/*jshint esversion: 6 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Chart, Form, FilterList, colors, xlabels, ylabels, compounds, compound_data, compounds_fractions, setGraphData } from './index';
import Grid from '@material-ui/core/Grid';
import SettingGraph from './SettingGraph'
import GridPaper from './GridPaper';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  chartGrid: {
    margin: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
  },
});

// Root Tag
class Root extends React.Component {

  constructor(props) {
    super(props);
    let xlabel = xlabels[0];
    let ylabel = ylabels[0];
    let base_a = 0;
    let base_a_out = compound_data['GaAs'][0].a;
    let compounds_checked = ["GaAs", "InAs", "AlAs", "GaSb", "InSb", "AlSb", "InP", "GaP", "AlP"]
    let [temp_raws, compound_raws, binaries_data] = setGraphData(ylabel, compounds_checked, compounds_fractions, base_a);
    let line_hight = 0;
    let refAreaLeft = '';
    let refAreaRight = '';
    let drag = 0;
    let cursorPosition = { x: 0, y: 0 };
    let compound_raws_out = compound_raws;
    let binaries_data_out = binaries_data;
    let left = parseInt((Math.min.apply(null, temp_raws.map(o => o.p)) - 0.01) * 1000, 10) / 1000;
    let right = parseInt((Math.max.apply(null, temp_raws.map(o => o.p)) + 0.01) * 1000, 10) / 1000;
    let bottom = Math.floor(parseInt((Math.min.apply(null, temp_raws.map(o => o[ylabel])) - 0.01) * 1000, 10) / 1000);
    let top = Math.ceil(parseInt((Math.max.apply(null, temp_raws.map(o => o[ylabel])) + 0.01) * 1000, 10) / 1000);
    let filter = {
      a_min: { init: 5, value: 5, on: false }, a_max: { init: 7, value: 7, on: false },
      Eg_min: { init: 0, value: 0, on: false }, Eg_max: { init: 3, value: 3, on: false },
      CB_min: { init: -5, value: -5, on: false }, CB_max: { init: -3, value: -3, on: false },
      VB_min: { init: -7, value: -7, on: false }, VB_max: { init: -4, value: -4, on: false },
      direct_only: { on: false }, indirect_only: { on: false }
    };

    this.state = {
      base_a, base_a_out, xlabel, ylabel, compounds_fractions, line_hight, refAreaLeft, refAreaRight, drag, cursorPosition,
      compounds, compound_raws, compound_raws_out, compounds_checked, binaries_data, binaries_data_out,
      left, right, bottom, top,
      filter,
    };
    this._onchange = this._onchange.bind(this);
    this._onchangeY = this._onchangeY.bind(this);
    this._onchangefraction = this._onchangefraction.bind(this);
    this._onchangeleft = this._onchangeleft.bind(this);
    this._onchangeright = this._onchangeright.bind(this);
    this.zoom = this.zoom.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this._onchangeX = this._onchangeX.bind(this);
    this._onchangeLatticeConstant = this._onchangeLatticeConstant.bind(this);
    this._getCursorPosition = this._getCursorPosition.bind(this);
    this._onChamgeFilter = this._onChamgeFilter.bind(this);
  }

  // Zoom in func.
  zoom() {
    let { refAreaLeft, refAreaRight, compound_raws, binaries_data, ylabel } = this.state;
    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      this.setState(() => ({
        refAreaLeft: '',
        refAreaRight: '',
        drag: 0
      }));
      return;
    }
    // xAxis domain
    if (refAreaLeft > refAreaRight)
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

    let temp_binaries_data = [];
    binaries_data.map(binary =>
      (refAreaLeft <= binary.p) && (binary.p <= refAreaRight) && (temp_binaries_data.push(binary))
    );
    
    compound_raws = compound_raws.map(compound_raw =>
      compound_raw.filter(item =>
        (refAreaLeft <= item.p) && (item.p <= refAreaRight)
      )
    )

    this.setState(() => ({
      refAreaLeft: '',
      refAreaRight: '',
      drag: 0,
      compound_raws: compound_raws,
      binaries_data: temp_binaries_data,
      left: parseInt((refAreaLeft - 0.01) * 10000, 10) / 10000,
      right: parseInt((refAreaRight + 0.01) * 10000, 10) / 10000,
      bottom: Math.floor(compound_raws.length === 0 ? 0 : parseInt((Math.min.apply(null, compound_raws.map(o => Math.min.apply(null, o.map(p => p[ylabel])))) - 0.01) * 1000, 10) / 1000),
      top: Math.ceil(compound_raws.length === 0 ? 0 : parseInt((Math.max.apply(null, compound_raws.map(o => Math.max.apply(null, o.map(p => p[ylabel])))) + 0.01) * 1000, 10) / 1000)
    }));
  }

  // Zoom out func.
  zoomOut() {
    const { compound_raws_out, binaries_data_out, ylabel } = this.state;
    this.setState(() => ({
      compound_raws: compound_raws_out,
      binaries_data: binaries_data_out,
      refAreaLeft: '',
      refAreaRight: '',
      left: parseInt((Math.min.apply(null, compound_raws_out.map(o => Math.min.apply(null, o.map(p => p.p)))) - 0.01) * 1000, 10) / 1000,
      right: parseInt((Math.max.apply(null, compound_raws_out.map(o => Math.max.apply(null, o.map(p => p.p)))) + 0.01) * 1000, 10) / 1000,
      bottom: Math.floor(compound_raws_out.length === 0 ? 0 : parseInt((Math.min.apply(null, compound_raws_out.map(o => Math.min.apply(null, o.map(p => p[ylabel])))) - 0.01) * 1000, 10) / 1000),
      top: Math.ceil(compound_raws_out.length === 0 ? 0 : parseInt((Math.max.apply(null, compound_raws_out.map(o => Math.max.apply(null, o.map(p => p[ylabel])))) + 0.01) * 1000, 10) / 1000)
    }));
  }


  // setting left value of expanding func.
  _onchangeleft(e) {
    if (e) this.setState({ refAreaLeft: e.xValue, drag: 1 });
  }

  // setting right value of expanding func.
  _onchangeright(e) {
    if (e) this.setState({ refAreaRight: e.xValue });
  }

  // Changing the compounds func.
  _onchange(e) {
    const { base_a, ylabel, compounds_fractions } = this.state;
    let temp_compounds_checked = this.state.compounds_checked.concat();
    if (e.target.checked) temp_compounds_checked.push(e.target.value);
    else temp_compounds_checked.splice(temp_compounds_checked.indexOf(e.target.value), 1);
    let [temp_raws, temp_compound_raws, temp_binaries_raws] = setGraphData(ylabel, temp_compounds_checked, compounds_fractions, base_a);

    this.setState({
      compound_raws: temp_compound_raws,
      compound_raws_out: temp_compound_raws,
      compounds_checked: temp_compounds_checked,
      binaries_data: temp_binaries_raws,
      binaries_data_out: temp_binaries_raws,
      left: parseInt((Math.min.apply(null, temp_raws.map(o => o.p)) - 0.01) * 1000, 10) / 1000,
      right: parseInt((Math.max.apply(null, temp_raws.map(o => o.p)) + 0.01) * 1000, 10) / 1000,
      bottom: Math.floor(parseInt((Math.min.apply(null, temp_raws.map(o => o[ylabel])) - 0.01) * 1000, 10) / 1000),
      top: Math.ceil(parseInt((Math.max.apply(null, temp_raws.map(o => o[ylabel])) + 0.01) * 1000, 10) / 1000)
    });
  }

  // Changing the y axis func.
  _onchangeY(e) {
    const { base_a, compounds_checked, compounds_fractions } = this.state;
    let temp_compounds_checked = compounds_checked.concat();
    let [temp_raws, temp_compound_raws, temp_binaries_raws] = setGraphData(e.target.value, temp_compounds_checked, compounds_fractions, base_a);
    this.setState({
      compound_raws: temp_compound_raws,
      compound_raws_out: temp_compound_raws,
      compounds_checked: temp_compounds_checked,
      binaries_data: temp_binaries_raws,
      binaries_data_out: temp_binaries_raws,
      left: parseInt((Math.min.apply(null, temp_raws.map(o => o.p)) - 0.01) * 1000, 10) / 1000,
      right: parseInt((Math.max.apply(null, temp_raws.map(o => o.p)) + 0.01) * 1000, 10) / 1000,
      bottom: Math.floor(parseInt((Math.min.apply(null, temp_raws.map(o => o[e.target.value])) - 0.01) * 1000, 10) / 1000),
      top: Math.ceil(parseInt((Math.max.apply(null, temp_raws.map(o => o[e.target.value])) + 0.01) * 1000, 10) / 1000),
      ylabel: e.target.value
    });
  }

  // Changing the x axis func.
  _onchangeX(e) {
    const { base_a_out, ylabel, compounds_checked, compounds_fractions } = this.state;
    let temp_compounds_checked = compounds_checked.concat();
    let temp_base_a = e.target.value === 'Lattice mismatch [%]' ? base_a_out : 0
    let [temp_raws, temp_compound_raws, temp_binaries_raws] = setGraphData(ylabel, temp_compounds_checked, compounds_fractions, temp_base_a);
    this.setState({
      compound_raws: temp_compound_raws,
      compound_raws_out: temp_compound_raws,
      compounds_checked: temp_compounds_checked,
      binaries_data: temp_binaries_raws,
      binaries_data_out: temp_binaries_raws,
      left: parseInt((Math.min.apply(null, temp_raws.map(o => o.p)) - 0.01) * 1000, 10) / 1000,
      right: parseInt((Math.max.apply(null, temp_raws.map(o => o.p)) + 0.01) * 1000, 10) / 1000,
      bottom: Math.floor(parseInt((Math.min.apply(null, temp_raws.map(o => o[ylabel])) - 0.01) * 1000, 10) / 1000),
      top: Math.ceil(parseInt((Math.max.apply(null, temp_raws.map(o => o[ylabel])) + 0.01) * 1000, 10) / 1000),
      base_a: temp_base_a,
      xlabel: e.target.value
    });
  }

  // Changing the lattice constant.
  _onchangeLatticeConstant(a) {
    const { base_a, xlabel, ylabel, compounds_checked, compounds_fractions } = this.state;
    let temp_compounds_checked = compounds_checked.concat();
    let temp_base_a_out = a
    let temp_base_a = xlabel === 'Lattice mismatch [%]' ? temp_base_a_out : 0
    let [temp_raws, temp_compound_raws, temp_binaries_raws] = setGraphData(ylabel, temp_compounds_checked, compounds_fractions, temp_base_a);
    this.setState({
      compound_raws: temp_compound_raws,
      compound_raws_out: temp_compound_raws,
      compounds_checked: temp_compounds_checked,
      binaries_data: temp_binaries_raws,
      binaries_data_out: temp_binaries_raws,
      left: parseInt((Math.min.apply(null, temp_raws.map(o => o.p)) - 0.01) * 1000, 10) / 1000,
      right: parseInt((Math.max.apply(null, temp_raws.map(o => o.p)) + 0.01) * 1000, 10) / 1000,
      bottom: Math.floor(parseInt((Math.min.apply(null, temp_raws.map(o => o[ylabel])) - 0.01) * 1000, 10) / 1000),
      top: Math.ceil(parseInt((Math.max.apply(null, temp_raws.map(o => o[ylabel])) + 0.01) * 1000, 10) / 1000),
      base_a: temp_base_a,
      base_a_out: temp_base_a_out
    });
  }

  // Changing the fraction of compounds
  _onchangefraction(e, name, axis) {
    const { base_a, ylabel, compounds_checked, compounds_fractions } = this.state;
    let temp_compounds_checked = compounds_checked.concat();
    let temp_compounds_fractions = JSON.parse(JSON.stringify(compounds_fractions));
    if (name) {
      temp_compounds_fractions[name][axis + 'Min'] = e[0];
      temp_compounds_fractions[name][axis + 'Max'] = e[1];
    } else {
      temp_compounds_fractions[e.target.className][e.target.name] = Number(e.target.value);
    }
    let [temp_raws, temp_compound_raws, temp_binaries_raws] = setGraphData(ylabel, temp_compounds_checked, temp_compounds_fractions, base_a);
    this.setState({
      compound_raws: temp_compound_raws,
      compound_raws_out: temp_compound_raws,
      compounds_checked: temp_compounds_checked,
      binaries_data: temp_binaries_raws,
      binaries_data_out: temp_binaries_raws,
      compounds_fractions: temp_compounds_fractions,
      left: parseInt((Math.min.apply(null, temp_raws.map(o => o.p)) - 0.01) * 1000, 10) / 1000,
      right: parseInt((Math.max.apply(null, temp_raws.map(o => o.p)) + 0.01) * 1000, 10) / 1000,
      bottom: Math.floor(parseInt((Math.min.apply(null, temp_raws.map(o => o[ylabel])) - 0.01) * 1000, 10) / 1000),
      top: Math.ceil(parseInt((Math.max.apply(null, temp_raws.map(o => o[ylabel])) + 0.01) * 1000, 10) / 1000)
    });
  }

  // Indicating a cursor position
  _getCursorPosition(e) {
    e && e.xValue && this.setState({ cursorPosition: { x: e.xValue.toFixed(3), y: e.yValue.toFixed(3) } })
  }


  _onChamgeFilter(e, type) {
    let tempFilter = JSON.parse(JSON.stringify(this.state.filter));
    if (type === 'a_on') {
      tempFilter.a_min.on = !tempFilter.a_min.on;
      tempFilter.a_max.on = !tempFilter.a_max.on;
    } else if (type === 'Eg_on') {
      tempFilter.Eg_min.on = !tempFilter.Eg_min.on;
      tempFilter.Eg_max.on = !tempFilter.Eg_max.on;
    } else if (type === 'CB_on') {
      tempFilter.CB_min.on = !tempFilter.CB_min.on;
      tempFilter.CB_max.on = !tempFilter.CB_max.on;
    } else if (type === 'VB_on') {
      tempFilter.VB_min.on = !tempFilter.VB_min.on;
      tempFilter.VB_max.on = !tempFilter.VB_max.on;
    } else if (type === 'direct') {
      tempFilter.direct_only.on = !tempFilter.direct_only.on;
    } else if (type === 'indirect') {
      tempFilter.indirect_only.on = !tempFilter.indirect_only.on;
    } else {
      tempFilter[type].value = e.target.value ? Number(e.target.value) : tempFilter[type].init;
    }
    this.setState({ filter: tempFilter });
  }

  render() {
    const { compounds, compound_raws, compounds_checked, compounds_fractions, binaries_data, xlabel, ylabel, line_hight, refAreaLeft, refAreaRight, drag, cursorPosition, left, right, bottom, top, filter } = this.state;
    const { classes } = this.props;
    let temp_compound_raws = JSON.parse(JSON.stringify(compound_raws)).map(list => list.filter(item =>
      (filter.a_min.on ? (filter.a_min.value <= item.a && item.a <= filter.a_max.value) : true) &&
      (filter.Eg_min.on ? (filter.Eg_min.value <= item.Eg && item.Eg <= filter.Eg_max.value) : true) &&
      (filter.CB_min.on ? (filter.CB_min.value <= item.CB && item.CB <= filter.CB_max.value) : true) &&
      (filter.VB_min.on ? (filter.VB_min.value <= item.VB && item.VB <= filter.VB_max.value) : true) &&
      (filter.direct_only.on ? (item.direct === 1) : true) &&
      (filter.indirect_only.on ? (item.direct === 0) : true)
    ));
    let temp_binaries_data = JSON.parse(JSON.stringify(binaries_data)).filter(list =>
      (filter.a_min.on ? (filter.a_min.value <= list.a && list.a <= filter.a_max.value) : true) &&
      (filter.Eg_min.on ? (filter.Eg_min.value <= list.Eg && list.Eg <= filter.Eg_max.value) : true) &&
      (filter.CB_min.on ? (filter.CB_min.value <= list.CB && list.CB <= filter.CB_max.value) : true) &&
      (filter.VB_min.on ? (filter.VB_min.value <= list.VB && list.VB <= filter.VB_max.value) : true) &&
      (filter.direct_only.on ? (list.direct === 1) : true) &&
      (filter.indirect_only.on ? (list.direct === 0) : true)
    );
    return (
      <Grid container className={classes.root} >
        <Grid container item xs={6}>
          <GridPaper xs={12}>
            <Chart
              compound_raws={temp_compound_raws}
              binaries_data={temp_binaries_data}
              xlabel={xlabel}
              ylabel={ylabel}
              line_hight={line_hight}
              refAreaLeft={refAreaLeft}
              refAreaRight={refAreaRight}
              drag={drag}
              cursorPosition={cursorPosition}
              _onchangeleft={this._onchangeleft}
              _onchangeright={this._onchangeright}
              _getCursorPosition={this._getCursorPosition}
              zoomOut={this.zoomOut}
              zoom={this.zoom}
              left={left}
              right={right}
              bottom={bottom}
              top={top}
            />
            <p style={{ textAlign: 'right', width: '100%' }} >x:{cursorPosition.x || '0.000'} y:{cursorPosition.y || '0.000'}</p>
            <SettingGraph compounds={compounds} compound_data={compound_data} _onchangeX={this._onchangeX} _onchangeY={this._onchangeY} zoomOut={this.zoomOut} _onchangeLatticeConstant={this._onchangeLatticeConstant} xlabels={xlabels} ylabels={ylabels} />
          </GridPaper>
        </Grid>
        <Grid container item xs={3}>
          <Form style={{ height: '100%' }} _onchange={this._onchange} _onchangeY={this._onchangeY} _onchangefraction={this._onchangefraction} compounds_fractions={compounds_fractions} compounds_checked={compounds_checked} />
        </Grid>
        <Grid container item xs={3}>
          <FilterList style={{ height: '100%' }} filter={filter} onChamgeFilter={this._onChamgeFilter} />
        </Grid>
      </Grid>
    )
  }
}

Root.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Root);