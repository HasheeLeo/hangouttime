import React from 'react';
import {StyleSheet} from 'react-native';
import {ScrollView} from 'react-navigation';

import {Theme} from '~/constants';

const AppScrollView = ({children}) => (
  <ScrollView style={styles.container}>
    {children}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.GRAY,
    padding: 5
  }
});

export default AppScrollView;
