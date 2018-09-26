/*jshint esversion: 6 */
import React from 'react';
import isEqual from 'lodash/isEqual';
import {colors, ylabels, compounds} from './index';
import PinnedSubheaderList from "./PinnedSubheaderList";
// Form Tag
export default class Form extends React.Component{

	shouldComponentUpdate(nextProps, nextState) {
		//for(let key in nextProps){
		//  !isEqual(nextProps[key], this.props[key]) && console.log(key, isEqual(nextProps[key], this.props[key]))
		//}
		//console.log(this.props.compounds_checked)
		const propsDiff = isEqual(nextProps, this.props);
		const stateDiff = isEqual(nextState, this.state);
		//console.log("propsDiff", propsDiff)
		//console.log("stateDiff", stateDiff)
		//console.log(!(propsDiff && stateDiff))
		return !(propsDiff && stateDiff);
	  }

	render () {
		const { compounds_fractions, compounds_checked, _onchangeY, _onchange, _onchangefraction } = this.props;
		return (
			<div>
				<PinnedSubheaderList compounds={compounds} compounds_fractions={compounds_fractions} compounds_checked={compounds_checked} _onchange={_onchange} _onchangefraction={_onchangefraction} />
			</div>
		)
	}
}
