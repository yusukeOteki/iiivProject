/*jshint esversion: 6 */
import React from 'react';
import isEqual from 'lodash/isEqual';
import {GridPaper, Filter} from ".";

export default class FilterList extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !(isEqual(nextProps, this.props) && isEqual(nextState, this.state));
  }

  render() {
    const { filter, onChamgeFilter } = this.props;

    return (
      <GridPaper xs={12}>
        <Filter style={{ height: '100%' }} filter={filter} onChamgeFilter={onChamgeFilter} />
      </GridPaper>
    )
  }
}
