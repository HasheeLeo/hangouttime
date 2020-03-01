import React from 'react';
import {StyleSheet} from 'react-native';
import {FAB as PaperFAB} from 'react-native-paper';

const FAB = ({onPress}) => (
  <PaperFAB
    icon="plus"
    style={styles.fab}
    onPress={onPress}
  />
);

const styles = StyleSheet.create({
  fab: {
    bottom: 15,
    right: 15,
    position: 'absolute'
  }
});

export default FAB;
