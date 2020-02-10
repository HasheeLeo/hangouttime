import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Chip, Title} from 'react-native-paper';

import PropTypes from 'prop-types';

import {Events, MomentFormat} from '~/constants';

EventDatesTimes.propTypes = {
  datesTimesMoments: PropTypes.array.isRequired,
  datesTimesVotes: PropTypes.object.isRequired,
  eventType: PropTypes.string.isRequired,
  onPressDateTime: PropTypes.func.isRequired,
  selectedDatesTimes: PropTypes.object.isRequired
};

function EventDatesTimes(props) {
  let datesTimes;
  let dateTimeText;
  if (props.eventType === Events.INVITED_EVENTS)
    dateTimeText = 'Select all the dates and times when you are available';
  else
    dateTimeText = 'Choose the final date and time for the event';
  
  datesTimes = props.datesTimesMoments.map(dateTime => {
    const key = dateTime.format('YYYY-MM-DD HH:mm');
    return (
      <Chip
        key={key}
        onPress={() => props.onPressDateTime(key)}
        selected={props.selectedDatesTimes[key]}
        style={styles.dateTime}
      >
        {`${dateTime.calendar(null, MomentFormat)} `}
        ({props.datesTimesVotes[key]})
      </Chip>
    );
  });

  return (
    <View style={styles.container}>
      <Title>{dateTimeText}</Title>
      <View style={styles.datesTimesContainer}>
        {datesTimes}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10
  },

  dateTime: {
    marginRight: 2,
    marginVertical: 2
  },

  datesTimesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 5
  }
});

export default EventDatesTimes;
