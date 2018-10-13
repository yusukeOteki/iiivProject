import React, { PureComponent } from 'react';
import { MuiThemeProvider } from 'material-ui/styles';
import { BrowserRouter, Route } from 'react-router-dom';

import CompoundGraph from '../components/CompoundGraph/Root';
import myTheme from '../src/theme/myThemeFile';

export default class App extends PureComponent {
  render() {
    return (
      <MuiThemeProvider theme={myTheme}>
        <BrowserRouter>
          <Route exact path='/' component={CompoundGraph} />
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}