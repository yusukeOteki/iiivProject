/*jshint esversion: 6 */
import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { 
  Chart, CompoundList, FilterList, SettingGraph, GridPaper, 
  xlabels, ylabels, compounds, compound_data, compounds_fractions, applyFilter, setGraphData, getGraphRange 
} from '.';

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
    let [left, right, bottom, top] = getGraphRange(temp_raws, 'p', ylabel);
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
    let { refAreaLeft, refAreaRight, compound_raws, ylabel, left, right, bottom, top } = this.state;
    let binaries_data = (refAreaLeft === refAreaRight || refAreaRight === '') ? this.state.binaries_data : [];
    if (!(refAreaLeft === refAreaRight || refAreaRight === '')) {
      if (refAreaLeft > refAreaRight) [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];
      this.state.binaries_data.map(binary => (refAreaLeft <= binary.p) && (binary.p <= refAreaRight) && (binaries_data.push(binary)));
      compound_raws = compound_raws.map(compound_raw => compound_raw.filter(item => (refAreaLeft <= item.p) && (item.p <= refAreaRight) ))
      left = parseInt((refAreaLeft - 0.01) * 10000, 10) / 10000
      right = parseInt((refAreaRight + 0.01) * 10000, 10) / 10000
      bottom = Math.floor(compound_raws.length === 0 ? 0 : parseInt((Math.min.apply(null, compound_raws.map(o => Math.min.apply(null, o.map(p => p[ylabel])))) - 0.01) * 1000, 10) / 1000)
      top = Math.ceil(compound_raws.length === 0 ? 0 : parseInt((Math.max.apply(null, compound_raws.map(o => Math.max.apply(null, o.map(p => p[ylabel])))) + 0.01) * 1000, 10) / 1000)
    }
    refAreaLeft = ''
    refAreaRight = ''
    let drag = 0
    this.setState(() => ({ refAreaLeft, refAreaRight, drag, compound_raws, binaries_data, left, right, bottom, top }));
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
    e && this.setState({ refAreaLeft: e.xValue, drag: 1 });
  }

  // setting right value of expanding func.
  _onchangeright(e) {
    e && this.setState({ refAreaRight: e.xValue });
  }

  // Changing the compounds func.
  _onchange(e) {
    const { base_a, ylabel, compounds_fractions } = this.state;
    let compounds_checked = this.state.compounds_checked.concat();
    (e.target.checked) ? compounds_checked.push(e.target.value) : compounds_checked.splice(compounds_checked.indexOf(e.target.value), 1);
    let [temp_raws, compound_raws, binaries_data] = setGraphData(ylabel, compounds_checked, compounds_fractions, base_a);
    let [left, right, bottom, top] = getGraphRange(temp_raws, 'p', ylabel);
    let compound_raws_out = compound_raws;
    let binaries_data_out = binaries_data;
    this.setState({ compound_raws, compound_raws_out, compounds_checked, binaries_data, binaries_data_out, left, right, bottom, top });
  }

  // Changing the y axis func.
  _onchangeY(e) {
    const { base_a, compounds_fractions } = this.state;
    let compounds_checked = this.state.compounds_checked.concat();
    let ylabel = e.target.value;
    let [temp_raws, compound_raws, binaries_data] = setGraphData(e.target.value, compounds_checked, compounds_fractions, base_a);
    let [left, right, bottom, top] = getGraphRange(temp_raws, 'p', ylabel);
    let compound_raws_out = compound_raws;
    let binaries_data_out = binaries_data;
    this.setState({ compound_raws, compound_raws_out, compounds_checked, binaries_data, binaries_data_out, left, right, bottom, top, ylabel });
  }

  // Changing the x axis func.
  _onchangeX(e) {
    const { ylabel, compounds_fractions } = this.state;
    let compounds_checked = this.state.compounds_checked.concat();
    let base_a = e.target.value === 'Lattice mismatch [%]' ? this.state.base_a_out : 0;
    let xlabel = e.target.value;
    let [temp_raws, compound_raws, binaries_data] = setGraphData(ylabel, compounds_checked, compounds_fractions, base_a);
    let [left, right, bottom, top] = getGraphRange(temp_raws, 'p', ylabel);
    let compound_raws_out = compound_raws;
    let binaries_data_out = binaries_data;
    this.setState({ compound_raws, compound_raws_out, compounds_checked, binaries_data, binaries_data_out, left, right, bottom, top, base_a, xlabel });
  }

  // Changing the lattice constant.
  _onchangeLatticeConstant(a) {
    const { xlabel, ylabel, compounds_fractions } = this.state;
    let compounds_checked = this.state.compounds_checked.concat();
    let base_a_out = a
    let base_a = xlabel === 'Lattice mismatch [%]' ? base_a_out : 0
    let [temp_raws, compound_raws, binaries_data] = setGraphData(ylabel, compounds_checked, compounds_fractions, base_a);
    let [left, right, bottom, top] = getGraphRange(temp_raws, 'p', ylabel);
    let compound_raws_out = compound_raws;
    let binaries_data_out = binaries_data;
    this.setState({ compound_raws, compound_raws_out, compounds_checked, binaries_data, binaries_data_out, left, right, bottom, top, base_a, base_a_out });
  }

  // Changing the fraction of compounds
  _onchangefraction(e, name, axis) {
    const { base_a, ylabel } = this.state;
    let compounds_checked = this.state.compounds_checked.concat();
    let compounds_fractions = JSON.parse(JSON.stringify(this.state.compounds_fractions));
    if (name) [ compounds_fractions[name][axis + 'Min'], compounds_fractions[name][axis + 'Max'] ] = [ e[0], e[1] ];
    else compounds_fractions[e.target.className][e.target.name] = Number(e.target.value);
    let [temp_raws, compound_raws, binaries_data] = setGraphData(ylabel, compounds_checked, compounds_fractions, base_a);
    let [left, right, bottom, top] = getGraphRange(temp_raws, 'p', ylabel);
    let compound_raws_out = compound_raws;
    let binaries_data_out = binaries_data;
    this.setState({ compound_raws, compound_raws_out, compounds_checked, binaries_data, binaries_data_out, compounds_fractions, left, right, bottom: bottom, top });
  }

  // Indicating a cursor position
  _getCursorPosition(e) {
    e && e.xValue && this.setState({ cursorPosition: { x: e.xValue.toFixed(3), y: e.yValue.toFixed(3) } })
  }


  _onChamgeFilter(e, type) {
    let filter = JSON.parse(JSON.stringify(this.state.filter));
    if (type === 'a_on') {
      filter.a_min.on = !filter.a_min.on;
      filter.a_max.on = !filter.a_max.on;
    } else if (type === 'Eg_on') {
      filter.Eg_min.on = !filter.Eg_min.on;
      filter.Eg_max.on = !filter.Eg_max.on;
    } else if (type === 'CB_on') {
      filter.CB_min.on = !filter.CB_min.on;
      filter.CB_max.on = !filter.CB_max.on;
    } else if (type === 'VB_on') {
      filter.VB_min.on = !filter.VB_min.on;
      filter.VB_max.on = !filter.VB_max.on;
    } else if (type === 'direct') {
      filter.direct_only.on = !filter.direct_only.on;
    } else if (type === 'indirect') {
      filter.indirect_only.on = !filter.indirect_only.on;
    } else {
      filter[type].value = e.target.value ? Number(e.target.value) : filter[type].init;
    }
    this.setState({ filter });
  }

  render() {
    const { compounds, compounds_checked, compounds_fractions, xlabel, ylabel, line_hight, refAreaLeft, refAreaRight, drag, cursorPosition, left, right, bottom, top, filter } = this.state;
    const { classes } = this.props;
    const [compound_raws, binaries_data] = applyFilter(this.state.compound_raws, this.state.binaries_data, filter);
    return (
      <Grid container className={classes.root} >
        <Grid container item xs={6}>
          <GridPaper xs={12}>
            <Chart
              compound_raws={compound_raws}
              binaries_data={binaries_data}
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
          <CompoundList style={{ height: '100%' }} _onchange={this._onchange} _onchangeY={this._onchangeY} _onchangefraction={this._onchangefraction} compounds_fractions={compounds_fractions} compounds_checked={compounds_checked} />
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