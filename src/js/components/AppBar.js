import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {Theme} from '~/constants';

export const AppBar = ({navigation}) => {
  return {
    headerLeft: () => (
      <MaterialIcons
        color={Theme.WHITE}
        name="menu"
        onPress={navigation.toggleDrawer}
        size={32}
      />
    ),
    headerLeftContainerStyle: {
      paddingLeft: 15
    }
  }
};

export const AppBarStyle = {
  headerStyle: {
    backgroundColor: Theme.PRIMARY,
    elevation: 0
  },
  headerTintColor: Theme.WHITE
};
