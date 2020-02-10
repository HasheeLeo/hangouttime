import React, {Fragment} from 'react';
import {View, StyleSheet} from 'react-native';
import {Headline, Paragraph, Text, Title} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import PropTypes from 'prop-types';

EventBasicInfo.propTypes = {
  eventObject: PropTypes.object.isRequired
};

function EventBasicInfo(props) {
  return (
    <Fragment>
      <Headline style={{textAlign: 'center'}}>
        {props.eventObject.name}
      </Headline>
      <Title>Basic Info</Title>
      <View style={styles.locationContainer}>
        <MaterialIcons name="location-on" size={20} />
        <Text style={styles.text}>{props.eventObject.location}</Text>
      </View>
      <Paragraph style={styles.text}>
        {
          props.eventObject.description ?
          props.eventObject.description :
          'No description provided.'
        }
      </Paragraph>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  locationContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 2
  },

  text: {
    fontSize: 15
  }
});

export default EventBasicInfo;
