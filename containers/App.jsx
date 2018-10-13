import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MuiThemeProvider } from 'material-ui/styles';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import CompoundGraph from '../components/CompoundGraph/Root';
import Header from '../components/Header';
import Counter from '../components/Counter';
import CounterActions from '../actions/counter';
import myTheme from '../src/theme/myThemeFile';

class App extends PureComponent {
  static propTypes = {
    counter: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { counter, actions } = this.props;
    return (
      <MuiThemeProvider theme={myTheme}>
        <BrowserRouter>
          <div>
            {/* <Header /> */}
            <Route exact path='/' component={CompoundGraph} />
            <Route path='/about' component={About} />
            <Route path='/friends' component={Friends} />

          </div>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}
//<Counter counter={counter} actions={actions} />
// Appコンポーネントにstateを流し込む
function mapStateToProps(state) {
  return {
    counter: state.counter,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, CounterActions), dispatch),
  };
}

const Home = () => (
  <div>
    <h2>Home</h2>
    <p>Welcome to ようこそ</p>
  </div>
)
const About = () => (
  <div>
    <h2>About</h2>
    <p>フレンズに投票するページです</p>
  </div>
)
const Friends = () => (
  <div>
    <h2>Friends</h2>
    <p>ここにフレンズのリストを書きます</p>
  </div>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
