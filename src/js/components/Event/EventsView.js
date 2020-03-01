import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {Card, Text, Title, Paragraph} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import moment from 'moment';
import PropTypes from 'prop-types';

import FAB from '~/components/FAB';
import {Events, MomentFormat, Routes, Theme} from '~/constants';

EventsView.propTypes = {
  events: PropTypes.array.isRequired,
  eventsType: PropTypes.oneOf([
    Events.GOING_EVENTS,
    Events.INVITED_EVENTS,
    Events.HOSTING_EVENTS
  ]).isRequired,
  isLoading: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired
};

function EventsView(props) {
  let events = null;
  if (!props.events.length) {
    if (props.isLoading) {
      events = (
        <View style={styles.helpTextContainer}>
          <ActivityIndicator color={Theme.PRIMARY} size="large" />
        </View>
      );
    }
    else {
      let helpText;
      if (props.eventsType === Events.GOING_EVENTS)
        helpText = 'Events with finalized dates and times will appear here.';
      else if (props.eventsType === Events.INVITED_EVENTS)
        helpText = 'Events that are not finalized will appear here.';
      else
        helpText = 'Events you create will appear here.';

      events = (
        <View style={styles.helpTextContainer}>
          <Title style={{textAlign: 'center'}}>{helpText}</Title>
        </View>
      );
    }
  }
  else {
    events = (
      <FlatList
        data={props.events}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Card
            elevation={3}
            onPress={() => props.navigation.navigate(Routes.EVENT, {
              [Events.EVENT_OBJECT]: item,
              [Events.EVENT_TYPE]: props.eventsType
            })}
            style={styles.eventCard}
          >
            <Card.Content>
              <Title>{item.name}</Title>
              <Paragraph>
                {
                  item.description ?
                  item.description :
                  'No description provided.'
                }
              </Paragraph>
              <View style={styles.iconTextAlign}>
                <MaterialIcons name="location-on" size={16} />
                <Text>{item.location}</Text>
              </View>
              <View style={styles.iconTextAlign}>
                <MaterialIcons name="date-range" size={16} />
                <Text>
                  {
                    item.finalDateTime ?
                    moment(item.finalDateTime).calendar(null, MomentFormat) :
                    'Date and time being decided.'
                  }
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}
      />
    );
  }

  return (
    <View style={styles.container}>
      {events}
      <FAB
        onPress={() => props.navigation.navigate(Routes.CREATE_EVENT)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.GRAY,
    flex: 1
  },

  eventCard: {
    margin: 5
  },

  helpTextContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },

  iconTextAlign: {
    alignItems: 'center',
    flexDirection: 'row'
  }
});

export default EventsView;
