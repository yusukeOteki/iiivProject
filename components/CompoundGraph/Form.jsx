/*jshint esversion: 6 */
import React from 'react';
import isEqual from 'lodash/isEqual';
import { compounds } from './index';
import PinnedSubheaderList from "./PinnedSubheaderList";
// Form Tag
export default class Form extends React.Component {

	shouldComponentUpdate(nextProps, nextState) {
		return !(isEqual(nextProps, this.props) && isEqual(nextState, this.state));
	}

	render() {
		const { compounds_fractions, compounds_checked, _onchangeY, _onchange, _onchangefraction } = this.props;

		return (
			<div>
				<PinnedSubheaderList compounds={compounds} compounds_fractions={compounds_fractions} compounds_checked={compounds_checked} _onchange={_onchange} _onchangefraction={_onchangefraction} />
			</div>
		)
	}
}
