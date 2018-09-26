import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/AddCircle';
import RemoveIcon from 'material-ui-icons/RemoveCircle';
import { withStyles } from 'material-ui/styles';


const styles = {
  button: {
    margin: 5,
  },
};

class Counter extends PureComponent {
  static propTypes = {
    counter: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { counter, actions, classes } = this.props;
    return (
      <div style={{ width: '100%' }}>
        <div className="centerDiv">
          <h2>count={counter.value}</h2>
        </div>
        <div className="centerDiv">
          <Button raised="true" color="primary" className={classes.button} onClick={actions.increment}>
            増加
            <AddIcon />
          </Button>
          <Button raised="true" color="secondary" className={classes.button} onClick={actions.decrement}>
            減少
            <RemoveIcon />
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Counter);
