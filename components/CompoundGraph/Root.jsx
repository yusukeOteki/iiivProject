/*jshint esversion: 6 */
import React from 'react';
//import './index.css';
import {Chart, Form, colors, xlabels, ylabels, compounds, setCompoundsData, compound_data, binaries_data, compounds_fractions, setGraphData} from './index';
import SettingGraph from './SettingGraph'

// Root Tag
export default class Root extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			compounds: compounds,
			compound_raws_out : [],
			compound_raws: [],
			compounds_checked: [],
			base_a: 0,
			base_a_out : compound_data['GaAs'][0].a,
			xlabel: xlabels[0],
			ylabel: ylabels[0],
			binaries_data: binaries_data,
			binaries_data_out: binaries_data,
			compounds_fractions: compounds_fractions,
			line_hight: 0,
			refAreaLeft : '',
			refAreaRight : '',
			drag: 0,
			cursorPosition: {x: 0, y: 0},
			left: parseInt((Math.min.apply(null,Object.keys(binaries_data).map( o => binaries_data[o][0].p ))-0.01)*1000, 10)/1000,
			right: parseInt((Math.max.apply(null,Object.keys(binaries_data).map( o => binaries_data[o][0].p ))+0.01)*1000, 10)/1000,
			bottom: Math.floor(parseInt((Math.min.apply(null,Object.keys(binaries_data).map( o => binaries_data[o][0][ylabels[0]] ))-0.1)*1000, 10)/1000),
			top: Math.ceil(parseInt((Math.max.apply(null,Object.keys(binaries_data).map( o => binaries_data[o][0][ylabels[0]] ))+0.1)*1000, 10)/1000),
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
	}

	// Zoom in func.
	zoom(){
		let { refAreaLeft, refAreaRight, compound_raws, binaries_data, ylabel } = this.state;
		if ( refAreaLeft === refAreaRight || refAreaRight === '' ) {
			this.setState( () => ({
				refAreaLeft : refAreaLeft,
				refAreaRight : refAreaRight,
				drag: 0
		  }) );
			return;
		}
		// xAxis domain
		if ( refAreaLeft > refAreaRight )
			[ refAreaLeft, refAreaRight ] = [ refAreaRight, refAreaLeft ];
		let temp_data = [];
		for(let i in compound_raws)
			(refAreaLeft <= compound_raws[i][0].p) && (compound_raws[i][0].p <= refAreaRight) &&
				temp_data.push( compound_raws[i] );
		
		let temp_binaries_data = [];
		Object.keys(binaries_data).map(binary =>
			(refAreaLeft <= binaries_data[binary][0].p) && (binaries_data[binary][0].p <= refAreaRight) && (temp_binaries_data[binaries_data[binary][0].latex+binary] = binaries_data[binary])
		);

		this.setState( () => ({
			refAreaLeft : '',
			refAreaRight : '',
			drag: 0,
			compound_raws : temp_data,
			binaries_data : temp_binaries_data,
			left : parseInt((refAreaLeft-0.01)*10000, 10)/10000,
			right : parseInt((refAreaRight+0.01)*10000, 10)/10000,
			bottom:Math.floor(temp_data.length===0?0:parseInt((Math.min.apply(null,temp_data.map( o => o[0][ylabel] ))-0.1)*1000, 10)/1000),
			top:Math.ceil(temp_data.length===0?0:parseInt((Math.max.apply(null,temp_data.map( o => o[0][ylabel] ))+0.1)*1000, 10)/1000)
		} ) );
	}

	// Zoom out func.
	zoomOut() {
		const { compound_raws_out, binaries_data_out, ylabel } = this.state;
		this.setState( () => ({
			compound_raws : compound_raws_out,
			binaries_data: binaries_data_out,
			refAreaLeft : '',
			refAreaRight : '',
			left:parseInt((Math.min.apply(null,Object.keys(compound_raws_out).map( o => compound_raws_out[o][0].p ))-0.01)*1000, 10)/1000,
			right:parseInt((Math.max.apply(null,Object.keys(compound_raws_out).map( o => compound_raws_out[o][0].p ))+0.01)*1000, 10)/1000,
			bottom:Math.floor(parseInt((Math.min.apply(null,Object.keys(compound_raws_out).map( o => compound_raws_out[o][0][ylabel] ))-0.1)*1000, 10)/1000),
			top:Math.ceil(parseInt((Math.max.apply(null,Object.keys(compound_raws_out).map( o => compound_raws_out[o][0][ylabel] ))+0.1)*1000, 10)/1000)
		}) );
	}

	// setting left value of expanding func.
	_onchangeleft(e){
		if(e) this.setState({refAreaLeft:e.xValue, drag: 1});
	}

	// setting right value of expanding func.
	_onchangeright(e){
		if(e) this.setState({refAreaRight:e.xValue});
	}

	// Changing the compounds func.
	_onchange(e) {
		const { base_a, ylabel } = this.state;
		let temp_compounds_checked = this.state.compounds_checked.concat();
		if(e.target.checked) temp_compounds_checked.push(e.target.value);
		else temp_compounds_checked.splice(temp_compounds_checked.indexOf(e.target.value),1);
		let [temp_raws, temp_compound_raws,temp_binaries_raws] = setGraphData(ylabel, temp_compounds_checked, compounds_fractions, base_a);
		this.setState({
			compound_raws:temp_compound_raws,
			compound_raws_out:temp_compound_raws,
			compounds_checked:temp_compounds_checked,
			binaries_data:temp_binaries_raws,
			binaries_data_out:temp_binaries_raws,
			left:parseInt((Math.min.apply(null,temp_raws.map( o => o.p ))-0.01)*1000, 10)/1000,
			right:parseInt((Math.max.apply(null,temp_raws.map( o => o.p ))+0.01)*1000, 10)/1000,
			bottom:Math.floor(parseInt((Math.min.apply(null,temp_raws.map( o => o[ylabel] ))-0.1)*1000, 10)/1000),
			top:Math.ceil(parseInt((Math.max.apply(null,temp_raws.map( o => o[ylabel] ))+0.1)*1000, 10)/1000)
		});
	}

	// Changing the y axis func.
	_onchangeY(e){
		const { base_a, compounds_checked, compounds_fractions } = this.state;
		let temp_compounds_checked = compounds_checked.concat();
		let [temp_raws, temp_compound_raws,temp_binaries_raws] = setGraphData(e.target.value, temp_compounds_checked, compounds_fractions, base_a);
		this.setState({
			compound_raws:temp_compound_raws,
			compound_raws_out:temp_compound_raws,
			compounds_checked:temp_compounds_checked,
			binaries_data:temp_binaries_raws,
			binaries_data_out:temp_binaries_raws,
			left:parseInt((Math.min.apply(null,temp_raws.map( o => o.p ))-0.01)*1000, 10)/1000,
			right:parseInt((Math.max.apply(null,temp_raws.map( o => o.p ))+0.01)*1000, 10)/1000,
			bottom:Math.floor(parseInt((Math.min.apply(null,temp_raws.map( o => o[e.target.value] ))-0.1)*1000, 10)/1000),
			top:Math.ceil(parseInt((Math.max.apply(null,temp_raws.map( o => o[e.target.value] ))+0.1)*1000, 10)/1000),
			ylabel:e.target.value
		});
	}

	// Changing the x axis func.
	_onchangeX(e){
		const { base_a_out, ylabel, compounds_checked, compounds_fractions } = this.state;
		let temp_compounds_checked = compounds_checked.concat();
		let temp_base_a = e.target.value==='Lattice mismatch [%]' ? base_a_out : 0
		let [temp_raws, temp_compound_raws,temp_binaries_raws] = setGraphData(ylabel, temp_compounds_checked, compounds_fractions, temp_base_a);
		this.setState({
			compound_raws: temp_compound_raws,
			compound_raws_out: temp_compound_raws,
			compounds_checked: temp_compounds_checked,
			binaries_data: temp_binaries_raws,
			binaries_data_out: temp_binaries_raws,
			left: parseInt((Math.min.apply(null,temp_raws.map( o => o.p ))-0.01)*1000, 10)/1000,
			right: parseInt((Math.max.apply(null,temp_raws.map( o => o.p ))+0.01)*1000, 10)/1000,
			bottom: Math.floor(parseInt((Math.min.apply(null,temp_raws.map( o => o[ylabel] ))-0.1)*1000, 10)/1000),
			top: Math.ceil(parseInt((Math.max.apply(null,temp_raws.map( o => o[ylabel] ))+0.1)*1000, 10)/1000),
			base_a: temp_base_a,
			xlabel:e.target.value
		});
	}

	// Changing the lattice constant.
	_onchangeLatticeConstant(a){
		const { base_a, xlabel, ylabel, compounds_checked, compounds_fractions } = this.state;
		let temp_compounds_checked = compounds_checked.concat();
		let temp_base_a_out = a
		let temp_base_a = xlabel==='Lattice mismatch [%]' ? temp_base_a_out : 0
		let [temp_raws, temp_compound_raws,temp_binaries_raws] = setGraphData(ylabel, temp_compounds_checked, compounds_fractions, temp_base_a);
		this.setState({
			compound_raws: temp_compound_raws,
			compound_raws_out: temp_compound_raws,
			compounds_checked: temp_compounds_checked,
			binaries_data: temp_binaries_raws,
			binaries_data_out: temp_binaries_raws,
			left: parseInt((Math.min.apply(null,temp_raws.map( o => o.p ))-0.01)*1000, 10)/1000,
			right: parseInt((Math.max.apply(null,temp_raws.map( o => o.p ))+0.01)*1000, 10)/1000,
			bottom: Math.floor(parseInt((Math.min.apply(null,temp_raws.map( o => o[ylabel] ))-0.1)*1000, 10)/1000),
			top: Math.ceil(parseInt((Math.max.apply(null,temp_raws.map( o => o[ylabel] ))+0.1)*1000, 10)/1000),
			base_a: temp_base_a,
			base_a_out: temp_base_a_out
		});
	}

	// Changing the fraction of compounds
	_onchangefraction(e, name, axis){
		const { base_a, ylabel, compounds_checked, compounds_fractions } = this.state;
		let temp_compounds_checked = compounds_checked.concat();
		let temp_compounds_fractions = compounds_fractions;
		if(name){
			temp_compounds_fractions[name][axis+'Min'] = e[0];
			temp_compounds_fractions[name][axis+'Max'] = e[1];
		}else{
			temp_compounds_fractions[e.target.className][e.target.name] = Number(e.target.value);
		}
		//console.log(temp_compounds_fractions[e.target.className][e.target.name])
		let [temp_raws, temp_compound_raws,temp_binaries_raws] = setGraphData(ylabel, temp_compounds_checked, temp_compounds_fractions, base_a);
		this.setState({
			compound_raws:temp_compound_raws,
			compound_raws_out:temp_compound_raws,
			compounds_checked:temp_compounds_checked,
			binaries_data:temp_binaries_raws,
			binaries_data_out:temp_binaries_raws,
			compounds_fractions:temp_compounds_fractions,
			left:parseInt((Math.min.apply(null,temp_raws.map( o => o.p ))-0.01)*1000, 10)/1000,
			right:parseInt((Math.max.apply(null,temp_raws.map( o => o.p ))+0.01)*1000, 10)/1000,
			bottom:Math.floor(parseInt((Math.min.apply(null,temp_raws.map( o => o[ylabel] ))-0.1)*1000, 10)/1000),
			top:Math.ceil(parseInt((Math.max.apply(null,temp_raws.map( o => o[ylabel] ))+0.1)*1000, 10)/1000)
		});
	}

	// Indicating a cursor position
	_getCursorPosition(e) {
		this.setState({cursorPosition: {x: e.xValue.toFixed(3), y:  e.yValue.toFixed(3)}})
	}

	render () {
		const { compounds, compound_raws, compounds_checked, compounds_fractions, binaries_data, xlabel, ylabel, line_hight, refAreaLeft, refAreaRight, drag, cursorPosition, left, right, bottom, top } = this.state;
		return (
			<div>
				<div style={{display: 'flex'}}>
					<div>
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
						<p style={{textAlign: 'right', width: '100%'}} >x:{cursorPosition.x || '0.000'} y:{cursorPosition.y || '0.000'}</p>
					</div>
					<SettingGraph compounds={compounds} compound_data={compound_data} _onchangeX={this._onchangeX} _onchangeY={this._onchangeY} zoomOut={this.zoomOut} _onchangeLatticeConstant={this._onchangeLatticeConstant} xlabels={xlabels} ylabels={ylabels} />
					<Form _onchange={this._onchange} _onchangeY={this._onchangeY} _onchangefraction={this._onchangefraction} compounds_fractions={compounds_fractions} compounds_checked={compounds_checked} />
				</div>
			</div>
		)
	}
}
