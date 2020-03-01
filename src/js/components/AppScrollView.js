import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useScrollToTop} from '@react-navigation/native';

import {Theme} from '~/constants';

const AppScrollView = ({children}) => {
  const ref = React.useRef(null);
  useScrollToTop(ref);

  return (
    <ScrollView ref={ref} style={styles.container}>
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.GRAY,
    padding: 5
  }
});

export default AppScrollView;
