import React, {Component, Fragment} from 'react';
import {Alert} from 'react-native';
import {Card, IconButton} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';

import firebase from '@react-native-firebase/app';
import moment from 'moment';
import PropTypes from 'prop-types';

import AppScrollView from '~/components/AppScrollView';
import EventBasicInfo from '~/components/Event/EventBasicInfo';

import GoingEventView from '~/views/Event/EventView/GoingEventView';
import InvitedEventView from '~/views/Event/EventView/InvitedEventView';
import HostingEventView from '~/views/Event/EventView/HostingEventView';

import {Events, Routes, Strings, Theme} from '~/constants';

class EventView extends Component {
  constructor(props) {
    super(props);
    this.eventObject = this.props.route.params[Events.EVENT_OBJECT];
    this.eventType = this.props.route.params[Events.EVENT_TYPE];

    this.state = {
      isDatesTimesLoading: true,
      isGuestsLoading: true,
      isUpdating: false
    };

    this.deleteEvent = this.deleteEvent.bind(this);
    this.fetchDatesTimes = this.fetchDatesTimes.bind(this);
    this.fetchGuests = this.fetchGuests.bind(this);
    this.onPressDelete = this.onPressDelete.bind(this);
    this.onPressEdit = this.onPressEdit.bind(this);
    this.props.navigation.setParams({
      onPressDelete: this.onPressDelete,
      onPressEdit: this.onPressEdit
    });
  }

  componentDidMount() {
    this.fetchDatesTimes();
    this.fetchGuests();
  }

  deleteEvent() {
    const user = firebase.auth().currentUser;
    if (!user)
      // THIS SHOULD NEVER HAPPEN
      return;

    if (user.uid !== this.eventObject.host)
      return;

    this.setState({isUpdating: true});
    let updatesObj = {};
    updatesObj[`events/${this.eventObject.id}`] = null;
    updatesObj[`events_datestimes/${this.eventObject.id}`] = null;
    updatesObj[`events_guests/${this.eventObject.id}`] = null;
    updatesObj[`users_hosting/${user.uid}/${this.eventObject.id}`] = null;

    this.eventObject.guests.forEach(guest => {
      updatesObj[`users_datestimes/${guest.uid}/${this.eventObject.id}`] = null;
      updatesObj[`users_going/${guest.uid}/${this.eventObject.id}`] = null;
      updatesObj[`users_invited/${guest.uid}/${this.eventObject.id}`] = null;
    });

    firebase.database().ref().update(updatesObj)
      .then(() => this.props.navigation.goBack())
      .catch(() => this.setState({isUpdating: false}));
  }

  fetchDatesTimes() {
    const eventId = this.eventObject.id;
    const database = firebase.database();
    const eventsDatesTimesRef = database.ref(`events_datestimes/${eventId}`);
    eventsDatesTimesRef.once('value').then(snapshot => {
      if (!snapshot.exists())
        return;

      const datesTimes = snapshot.val();
      const datesTimesMoments = Object.keys(datesTimes).map(dateTime => (
        moment(dateTime)
      ));
      this.eventObject.datesTimesMoments = datesTimesMoments;
      this.eventObject.datesTimesVotes = datesTimes;
      this.setState({isDatesTimesLoading: false});
    });
  }

  fetchGuests() {
    this.eventObject.guests = [];
    const eventId = this.eventObject.id;
    const database = firebase.database();
    database.ref(`events_guests/${eventId}`).once('value').then(snapshot => {
      if (!snapshot.exists()) {
        this.setState({isGuestsLoading: false});
        return;
      }

      const guests = snapshot.val();
      for (const uid in guests) {
        if (!guests.hasOwnProperty(uid))
          continue;

        this.eventObject.guests.push({
          uid: uid,
          name: guests[uid].name
        });
      }
      this.setState({isGuestsLoading: false});
    });
  }

  onPressDelete() {
    const user = firebase.auth().currentUser;
    if (!user)
      // THIS SHOULD NEVER HAPPEN
      return;

    if (user.uid !== this.eventObject.host)
      return;

    Alert.alert(Strings.Event.DELETE_TITLE,
      Strings.Event.DELETE_MSG + this.eventObject.name + '?',
      [
        {style: 'cancel', text: Strings.Actions.CANCEL},
        {
          onPress: () => this.deleteEvent(),
          style: 'destructive',
          text: Strings.Actions.CONFIRM
        }
      ]
    );
  }

  onPressEdit() {
    this.props.navigation.navigate(Routes.EDIT_EVENT, {
      [Events.EVENT_OBJECT]: this.eventObject
    });
  }

  render() {
    if (this.state.isDatesTimesLoading || this.state.isGuestsLoading)
      return null;

    let eventView;
    if (this.eventType === Events.GOING_EVENTS)
      eventView = (
        <GoingEventView
          eventId={this.eventObject.id}
          guests={this.eventObject.guests}
          navigation={this.props.navigation}
        />
      );
    else if (this.eventType === Events.INVITED_EVENTS)
      eventView = (
        <InvitedEventView
          eventObject={this.eventObject}
          navigation={this.props.navigation}
        />
      );
    else
      eventView = (
        <HostingEventView
          eventObject={this.eventObject}
          navigation={this.props.navigation}
        />
      );

    return (
      <AppScrollView>
        <Spinner color={Theme.PRIMARY} visible={this.state.isUpdating} />
        <Card elevation={3}>
          <Card.Content>
            <EventBasicInfo eventObject={this.eventObject} />
            {eventView}
          </Card.Content>
        </Card>
      </AppScrollView>
    );
  }
}

EventView.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        [Events.EVENT_OBJECT]: PropTypes.object.isRequired,
        [Events.EVENT_TYPE]: PropTypes.oneOf([
          Events.GOING_EVENTS,
          Events.INVITED_EVENTS,
          Events.HOSTING_EVENTS
        ]).isRequired
      }).isRequired
    })
  })
};

export default EventView;
