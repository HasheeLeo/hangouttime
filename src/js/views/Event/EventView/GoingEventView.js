import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Title} from 'react-native-paper';

import firebase from 'react-native-firebase';
import moment from 'moment';
import PropTypes from 'prop-types';

import EventGuestList from '~/components/Event/EventGuestList';
import {MomentFormat} from '~/constants';

class GoingEventView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateTime: null
    };
  }

  componentDidMount() {
    const database = firebase.database();
    const dateTimePath = `events/${this.props.eventId}/finalDateTime`;
    database.ref(dateTimePath).once('value', snapshot => {
      if (!snapshot.exists())
        return;
      
      this.setState({dateTime: snapshot.val()});
    });
  }

  render() {
    return (
      <View style={styles.dateTimeContainer}>
        <Title>Date and Time</Title>
        <Text>
          {moment(this.state.dateTime).calendar(null, MomentFormat)}
        </Text>
        <EventGuestList guests={this.props.guests} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dateTimeContainer: {
    marginVertical: 10
  }
});

GoingEventView.propTypes = {
  eventId: PropTypes.string.isRequired
};

export default GoingEventView;
