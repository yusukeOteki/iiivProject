/*jshint esversion: 6 */
import React from 'react';
//import './index.css';
import {Chart, Form, colors, ylabels, compounds, setCompoundsData, compound_data, binaries_data, compounds_fractions, setGraphData} from './index';

// Root Tag
export default class Root extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			compounds: compounds,
			compound_raws_out : [],
			compound_raws: [],
			raws: [],
			compounds_checked: [],
			ylabel: ylabels[0],
			binaries_data: binaries_data,
			binaries_data_out: binaries_data,
			compounds_fractions: compounds_fractions,
			line_hight: 0,
			refAreaLeft : '',
			refAreaRight : '',
			left: parseInt((Math.min.apply(null,Object.keys(binaries_data).map( o => binaries_data[o][0].a ))-0.01)*1000, 10)/1000,
			right: parseInt((Math.max.apply(null,Object.keys(binaries_data).map( o => binaries_data[o][0].a ))+0.01)*1000, 10)/1000,
			bottom: parseInt((Math.min.apply(null,Object.keys(binaries_data).map( o => binaries_data[o][0][ylabels[0]] ))-0.1)*1000, 10)/1000,
			top: parseInt((Math.max.apply(null,Object.keys(binaries_data).map( o => binaries_data[o][0][ylabels[0]] ))+0.1)*1000, 10)/1000,
		};
		this._onchange = this._onchange.bind(this);
		this._onchangeY = this._onchangeY.bind(this);
		this._onchangefraction = this._onchangefraction.bind(this);
		this._onchangeleft = this._onchangeleft.bind(this);
		this._onchangeright = this._onchangeright.bind(this);
		this.zoom = this.zoom.bind(this);
	}

	// Zoom in func.
	zoom(){
		let { refAreaLeft, refAreaRight, compound_raws, binaries_data, ylabel } = this.state;
		if ( refAreaLeft === refAreaRight || refAreaRight === '' ) {
			this.setState( () => ({
				refAreaLeft : refAreaLeft,
				refAreaRight : refAreaRight
		  }) );
			return;
		}
		// xAxis domain
		if ( refAreaLeft > refAreaRight )
			[ refAreaLeft, refAreaRight ] = [ refAreaRight, refAreaLeft ];
		let temp_data = [];
		for(let i in compound_raws)
			temp_data.push( compound_raws[i].filter(compound_raw => (refAreaLeft <= compound_raw.a) && (compound_raw.a <= refAreaRight) ) );

		let temp_binaries_data = [];
		Object.keys(binaries_data).map(binary =>
			(refAreaLeft <= binaries_data[binary][0].a) && (binaries_data[binary][0].a <= refAreaRight) && (temp_binaries_data[binaries_data[binary][0].latex+binary] = binaries_data[binary])
		);

		this.setState( () => ({
		  refAreaLeft : refAreaLeft,
		  refAreaRight : refAreaRight,
		  compound_raws : temp_data,
		  binaries_data : temp_binaries_data,
		  left : parseInt((refAreaLeft-0.01)*10000, 10)/10000,
		  right : parseInt((refAreaRight+0.01)*10000, 10)/10000,
		  bottom:temp_data.length===0?0:parseInt((Math.min.apply(null,temp_data[0].map( o => o[ylabel] ))-0.1)*1000, 10)/1000,
		  top:temp_data.length===0?0:parseInt((Math.max.apply(null,temp_data[0].map( o => o[ylabel] ))+0.1)*1000, 10)/1000
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
			left:parseInt((Math.min.apply(null,Object.keys(binaries_data_out).map( o => binaries_data_out[o][0].a ))-0.01)*1000, 10)/1000,
			right:parseInt((Math.max.apply(null,Object.keys(binaries_data_out).map( o => binaries_data_out[o][0].a ))+0.01)*1000, 10)/1000,
			bottom:parseInt((Math.min.apply(null,Object.keys(binaries_data_out).map( o => binaries_data_out[o][0][ylabel] ))-0.1)*1000, 10)/1000,
			top:parseInt((Math.max.apply(null,Object.keys(binaries_data_out).map( o => binaries_data_out[o][0][ylabel] ))+0.1)*1000, 10)/1000
		}) );
	}

	// setting left value of expanding func.
	_onchangeleft(e){
		if(e) this.setState({refAreaLeft:e.xValue});
	}

	// setting right value of expanding func.
	_onchangeright(e){
		if(e) this.setState({refAreaRight:e.xValue});
	}

	// Changing the compounds func.
	_onchange(e) {
		const { ylabel } = this.state;
		let temp_compounds_checked = this.state.compounds_checked.concat();
		if(e.target.checked) temp_compounds_checked.push(e.target.value);
		else temp_compounds_checked.splice(temp_compounds_checked.indexOf(e.target.value),1);
		let [temp_raws, temp_compound_raws,temp_binaries_raws] = setGraphData(ylabel, temp_compounds_checked, compounds_fractions);
		this.setState({
			compound_raws:temp_compound_raws,
			compound_raws_out:temp_compound_raws,
			raws:temp_raws,
			compounds_checked:temp_compounds_checked,
			binaries_data:temp_binaries_raws,
			binaries_data_out:temp_binaries_raws,
			left:parseInt((Math.min.apply(null,temp_raws.map( o => o.a ))-0.01)*1000, 10)/1000,
			right:parseInt((Math.max.apply(null,temp_raws.map( o => o.a ))+0.01)*1000, 10)/1000,
			bottom:parseInt((Math.min.apply(null,temp_raws.map( o => o[ylabel] ))-0.1)*1000, 10)/1000,
			top:parseInt((Math.max.apply(null,temp_raws.map( o => o[ylabel] ))+0.1)*1000, 10)/1000
		});
	}

	// Changing the y axis func.
	_onchangeY(e){
		const { compounds_checked, compounds_fractions } = this.state;
		let temp_compounds_checked = compounds_checked.concat();
		let [temp_raws, temp_compound_raws,temp_binaries_raws] = setGraphData(e.target.value, temp_compounds_checked, compounds_fractions);
		this.setState({
			compound_raws:temp_compound_raws,
			compound_raws_out:temp_compound_raws,
			raws:temp_raws,
			compounds_checked:temp_compounds_checked,
			binaries_data:temp_binaries_raws,
			binaries_data_out:temp_binaries_raws,
			left:parseInt((Math.min.apply(null,temp_raws.map( o => o.a ))-0.01)*1000, 10)/1000,
			right:parseInt((Math.max.apply(null,temp_raws.map( o => o.a ))+0.01)*1000, 10)/1000,
			bottom:parseInt((Math.min.apply(null,temp_raws.map( o => o[e.target.value] ))-0.1)*1000, 10)/1000,
			top:parseInt((Math.max.apply(null,temp_raws.map( o => o[e.target.value] ))+0.1)*1000, 10)/1000,
			ylabel:e.target.value
		});
	}

	// Changing the fraction of compounds
	_onchangefraction(e, name, axis){
		const { ylabel, compounds_checked, compounds_fractions } = this.state;
		let temp_compounds_checked = compounds_checked.concat();
		let temp_compounds_fractions = compounds_fractions;
		if(name){
			temp_compounds_fractions[name][axis+'Min'] = e[0];
			temp_compounds_fractions[name][axis+'Max'] = e[1];
		}else{
			temp_compounds_fractions[e.target.className][e.target.name] = Number(e.target.value);
		}
		//console.log(temp_compounds_fractions[e.target.className][e.target.name])
		let [temp_raws, temp_compound_raws,temp_binaries_raws] = setGraphData(ylabel, temp_compounds_checked, temp_compounds_fractions);
		this.setState({
			compound_raws:temp_compound_raws,
			compound_raws_out:temp_compound_raws,
			raws:temp_raws,
			compounds_checked:temp_compounds_checked,
			binaries_data:temp_binaries_raws,
			binaries_data_out:temp_binaries_raws,
			compounds_fractions:temp_compounds_fractions,
			left:parseInt((Math.min.apply(null,temp_raws.map( o => o.a ))-0.01)*1000, 10)/1000,
			right:parseInt((Math.max.apply(null,temp_raws.map( o => o.a ))+0.01)*1000, 10)/1000,
			bottom:parseInt((Math.min.apply(null,temp_raws.map( o => o[ylabel] ))-0.1)*1000, 10)/1000,
			top:parseInt((Math.max.apply(null,temp_raws.map( o => o[ylabel] ))+0.1)*1000, 10)/1000
		});
	}

	render () {
		const { compounds, raws, compound_raws, compounds_checked, compounds_fractions, binaries_data, ylabel, line_hight, refAreaLeft, left, right, bottom, top } = this.state;
		return (
			<div>
				<div style={{display: 'flex'}}>
					<Chart
						raws={raws}
						compound_raws={compound_raws}
						binaries_data={binaries_data}
						ylabel={ylabel}
						line_hight={line_hight}
						refAreaLeft={refAreaLeft}
						_onchangeleft={this._onchangeleft}
						_onchangeright={this._onchangeright}
						zoomOut={this.zoomOut}
						zoom={this.zoom}
						left={left}
						right={right}
						bottom={bottom}
						top={top}
					/>
				<div style={{display: 'flex', flexDirection: 'column'}}>
						<input type="button" className="btn update" onClick={this.zoomOut.bind( this )} value="Zoom Out" />
						<select name="band" id="band" onChange={this._onchangeY}>
							{ylabels.map((label,i) =>
								<option key={`label-${i}`} value={label}>{label}</option>
							)}
						</select>
					</div>
					<Form _onchange={this._onchange} _onchangeY={this._onchangeY} _onchangefraction={this._onchangefraction} compounds_fractions={compounds_fractions} compounds_checked={compounds_checked} />
				</div>
			</div>
		)
	}
}
