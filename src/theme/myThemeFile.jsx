import { createMuiTheme } from 'material-ui/styles';
import indigo from 'material-ui/colors/indigo';
import pink from 'material-ui/colors/pink';
import red from 'material-ui/colors/red';

// All the following keys are optional.
// We try our best to provide a great default value.
const myTheme = createMuiTheme({
  palette: {
    contrastThreshold: 3,
    tonalOffset: 0.2,
    primary: indigo,
    secondary: pink,
    error: {
      main: red[500],
    },
  },
});

export default myTheme;
