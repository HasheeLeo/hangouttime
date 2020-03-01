import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {Card, Title} from 'react-native-paper';

import {Theme} from '~/constants';

const DataList = (props) => {
  let output;
  if (!props.data.length) {
    if (props.isLoading)
      output = (
        <View style={styles.outputContainer}>
          <ActivityIndicator color={Theme.PRIMARY} size="large" />
        </View>
      );
    else
      output = (
        <View style={styles.outputContainer}>
          <Title>{props.noDataOutput}</Title>
        </View>
      );
  }
  else {
    output = (
      <Card elevation={3} style={styles.card}>
        <FlatList
          data={props.data}
          extraData={props.extraData}
          keyExtractor={props.keyExtractor}
          renderItem={props.renderItem}
        />
        {
          props.children ?
          <Card.Content style={styles.children}>
            {props.children}
          </Card.Content> :
          null
        }
      </Card>
    );
  }
  return output;
};

const styles = StyleSheet.create({
  card: {
    margin: 5
  },

  children: {
    marginTop: 15
  },

  outputContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  }
});

export default DataList;
