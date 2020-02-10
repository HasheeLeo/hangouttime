import React, {Component} from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';

import AppContainer from '~/navigation';
import {Theme} from '~/constants';

class App extends Component {
  render() {
    return (
      <PaperProvider theme={theme}>
        <AppContainer />
      </PaperProvider>
    );
  }
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Theme.PRIMARY,
    accent: Theme.ACCENT
  }
};

export default App;
