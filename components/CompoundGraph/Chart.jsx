/*jshint esversion: 6 */
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Label, LabelList, ReferenceLine, ReferenceArea} from 'recharts';
import {colors, compounds} from './index';

// Chart Tag
export default class SimpleScatterChart extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			ReferenceLine_display: 0,
			ReferenceLine_y: 0,
			ReferenceLine_x: 0,
			clicks : []
		};
		this._onchangelineheight = this._onchangelineheight.bind(this);
	}

	// Indicating a line func.
	_onchangelineheight(e, props){
		let temp_clicks = this.state.clicks.concat();
		temp_clicks.push(new Date().getTime());
		this.setState( () => ({clicks:temp_clicks}));
		let timeout
		let time = 600
		clearTimeout(timeout);
		timeout = setTimeout(() =>{
			(this.state.clicks.length > 1 && this.state.clicks[this.state.clicks.length - 1] - this.state.clicks[this.state.clicks.length - 2] < time && e && e.yValue && e.xValue) &&
				this.setState({ReferenceLine_y: e.yValue, ReferenceLine_x: e.xValue, clicks:[]})
		}, time);
	}

	// Indicating a tooltip func.
	renderTooltip(props) {
		const { active, payload } = props;
		if (active && payload && payload.length) {
		  const x = payload[0];
		  return (
				<div style={{ backgroundColor: '#fff', border: '1px solid #999', margin: 0, padding: 10 }}>
				  <p>{x.payload.latex}</p>
				  <p>{x.name}: {x.payload.a} A</p>
				  {x.payload.a ===x.payload.p ? '' : <p>Lattice mismatch: {parseInt(x.payload.p*100000, 10)/100000} %</p>}
				  <p>Eg: {x.payload.Eg} eV</p>
				  <p>CB: {x.payload.CB} eV</p>
				  <p>VB: {x.payload.VB} eV</p>
				</div>
		  );
		}
	}

	render () {
		const { compound_raws, binaries_data, refAreaLeft, refAreaRight, drag, base_a, left, right, bottom, top, xlabel, ylabel, zoom, _onchangeleft, _onchangeright } = this.props;
		return (
			<ScatterChart width={1300/2} height={900/2} margin={{top: 20, right: 20, bottom: 20, left: 50}}
				onClick={ e => this._onchangelineheight(e, this.props)}
				onMouseDown = { e => _onchangeleft(e) }
				onMouseMove = { e => {e && refAreaLeft && _onchangeright(e)} }
				onMouseUp = { e => zoom( this ) }
			>
				<CartesianGrid />
				<XAxis dataKey={'p'} type="number" domain={[left, right]} name='lattice constant'>
					<Label value={`${xlabel}`} position="bottom" />
				</XAxis>
				<YAxis dataKey={ylabel} type="number" domain={[bottom, top]} name='energy'>
					<Label value={`${ylabel} [eV]`} position='left' offset={30} textAnchor='middle' angle={-90} />
				</YAxis>
				<ZAxis range={[50]}/>
				{Object.keys(compound_raws).map((compound,i)=>{
					return (compound_raws[compound].length>0) ?
						<Scatter name='compounds_scatter' key={`compound-${i}`} data={compound_raws[compound]} fill={colors[Object.keys(compounds).indexOf(compound_raws[compound][0].compound)]} shape={compound_raws[compound][0].direct?"circle":"triangle"} /> : ''
				})}
				{Object.keys(binaries_data).map((binary,i)=>{
					return (
						<Scatter name='binaries_scatter' key={`binary-${i}`} data={binaries_data[binary]} shape={binaries_data[binary][0].direct?"circle":"triangle"} >
							<LabelList dataKey='latex' position='top' />
						</Scatter>
					)
				})}
				{
					(refAreaLeft && refAreaRight && drag) ?
					(	<ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} /> ) : null
				}
				<Tooltip cursor={{strokeDasharray: '3 3'}} content={this.renderTooltip} />
				<ReferenceLine y={this.state.ReferenceLine_y} stroke={this.state.ReferenceLine_y?"black":""} />
				<ReferenceLine x={this.state.ReferenceLine_x} stroke={this.state.ReferenceLine_x?"black":""} />
			</ScatterChart>
		)
  }
}
