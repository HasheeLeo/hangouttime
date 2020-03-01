import React, {Component} from 'react';
import {Alert} from 'react-native';
import firebase from '@react-native-firebase/app';

import EventsView from '~/components/Event/EventsView';
import {Events, Strings} from '~/constants';

class GoingEventsView extends Component {
  constructor(props) {
    super(props);
    this.eventsType = this.props.route.params[Events.EVENTS_TYPE];

    this.state = {
      events: [],
      isLoading: false
    };

    this.attachFirebaseListeners = this.attachFirebaseListeners.bind(this);
    this.detachFirebaseListeners = this.detachFirebaseListeners.bind(this);
    this.onAddEvent = this.onAddEvent.bind(this);
    this.onChangeEvent = this.onChangeEvent.bind(this);
    this.onRemoveEvent = this.onRemoveEvent.bind(this);
  }

  attachFirebaseListeners() {
    const user = firebase.auth().currentUser;
    if (!user)
      // THIS SHOULD NEVER HAPPEN
      return;

    const database = firebase.database();
    let eventsRef;
    if (this.eventsType === Events.GOING_EVENTS)
      eventsRef = database.ref(`users_going/${user.uid}`);
    else if (this.eventsType === Events.INVITED_EVENTS)
      eventsRef = database.ref(`users_invited/${user.uid}`);
    else
      eventsRef = database.ref(`users_hosting/${user.uid}`);

    eventsRef.on('child_added', this.onAddEvent);
    eventsRef.on('child_removed', this.onRemoveEvent);

    // Alpha stuff
    if (this.eventsType === Events.GOING_EVENTS) {
      const database = firebase.database();
      const firstTimeRef = database.ref(`users/${user.uid}/firstTime`);
      firstTimeRef.once('value').then(snapshot => {
        if (!snapshot.exists())
          return;

        Alert.alert(Strings.Alpha.ALERT_TITLE, Strings.Alpha.ALERT_MSG,
          [{text: 'Understood', onPress: () => firstTimeRef.set(null)}],
          {cancelable: false});
      });
    }
  }

  componentDidMount() {
    this.attachFirebaseListeners();
  }

  componentWillUnmount() {
    this.detachFirebaseListeners();
  }

  detachFirebaseListeners() {
    const user = firebase.auth().currentUser;
    if (!user)
      // THIS SHOULD NEVER HAPPEN
      return;

    const database = firebase.database();
    let eventsRef;
    if (eventsRef === Events.GOING_EVENTS)
      eventsRef = database.ref(`users_going/${user.uid}`);
    else if (eventsRef === Events.INVITED_EVENTS)
      eventsRef = database.ref(`users_invited/${user.uid}`);
    else
      eventsRef = database.ref(`users_hosting/${user.uid}`);

    eventsRef.off();
    database.ref('events').off();
  }

  onAddEvent(snapshot) {
    this.setState({isLoading: true});
    if (!snapshot.exists()) {
      this.setState({isLoading: false});
      return;
    }

    const eventId = snapshot.key;
    const eventRef = firebase.database().ref(`events/${eventId}`);
    eventRef.once('value').then(snapshot => {
      if (!snapshot.exists()) {
        this.setState({isLoading: false});
        return;
      }

      let event = snapshot.val();
      event.id = eventId;
      this.setState(prevState => ({
        events: [...prevState.events, event],
        isLoading: false
      }));
      eventRef.on('value', this.onChangeEvent);
    });
  }

  onChangeEvent(snapshot) {
    // If event is being deleted, change event will still be called, so catering
    // for that case here.
    if (!snapshot.exists())
      return;

    this.setState(prevState => {
      let newEvents = prevState.events.slice();
      const index = newEvents.findIndex(event => event.id === snapshot.key);
      if (index === -1)
        // TODO could this possibly remove all state?
        return;

      let changedEvent = snapshot.val();
      changedEvent.id = snapshot.key;
      newEvents[index] = changedEvent;

      return {events: newEvents};
    });
  }

  onRemoveEvent(snapshot) {
    this.setState(prevState => ({
      events: prevState.events.filter(event => event.id !== snapshot.key)
    }));
  }

  render() {
    return (
      <EventsView
        events={this.state.events}
        eventsType={this.eventsType}
        isLoading={this.state.isLoading}
        navigation={this.props.navigation}
      />
    );
  }
}

export default GoingEventsView;
