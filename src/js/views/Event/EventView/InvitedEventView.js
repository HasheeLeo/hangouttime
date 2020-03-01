import React, {Component, Fragment} from 'react';

import firebase from '@react-native-firebase/app';
import PropTypes from 'prop-types';

import SaveButton from '~/components/SaveButton';
import EventDatesTimes from '~/components/Event/EventDatesTimes';
import EventGuestList from '~/components/Event/EventGuestList';

import {Events} from '~/constants';

class InvitedEventView extends Component {
  constructor(props) {
    super(props);
    this.eventObject = this.props.eventObject;

    this.state = {
      datesTimesVotes: this.eventObject.datesTimesVotes,
      isSaving: false,
      selectedDatesTimes: {}
    };

    this.onPressSave = this.onPressSave.bind(this);
    this.saveSelectedDatesTimes = this.saveSelectedDatesTimes.bind(this);
    this.voteDateTime = this.voteDateTime.bind(this);
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    // THIS SHOULD NEVER HAPPEN
    if (!user)
      return;

    const userRefString = `users_datestimes/${user.uid}/${this.eventObject.id}`;
    const userDatesTimesRef = firebase.database().ref(userRefString);
    userDatesTimesRef.once('value').then(snapshot => {
      if (!snapshot.exists())
        return;

      const selectedDatesTimes = snapshot.val();
      if (selectedDatesTimes)
        this.setState({selectedDatesTimes: selectedDatesTimes})
    });
  }

  onPressSave() {
    this.saveSelectedDatesTimes();
  }

  saveSelectedDatesTimes() {
    const user = firebase.auth().currentUser;
    // THIS SHOULD NEVER HAPPEN
    if (!user)
      return;

    this.setState({isSaving: true});
    const database = firebase.database();
    const refString = `users_datestimes/${user.uid}/${this.eventObject.id}`;
    const userDatesTimesRef = database.ref(refString);
    userDatesTimesRef.once('value').then(snapshot => {
      let oldSelectedDatesTimes = null;
      if (snapshot.exists())
        oldSelectedDatesTimes = snapshot.val();

      const eventRefString = `events_datestimes/${this.eventObject.id}`;
      database.ref(eventRefString).transaction(eventDatesTimes => {
        if (eventDatesTimes) {
          for (const dateTime in eventDatesTimes) {
            if (!eventDatesTimes.hasOwnProperty(dateTime))
              continue;

            if (oldSelectedDatesTimes && oldSelectedDatesTimes[dateTime])
              eventDatesTimes[dateTime]--;

            if (this.state.selectedDatesTimes[dateTime])
              eventDatesTimes[dateTime]++;
          }
        }
        return eventDatesTimes;

      }, () => userDatesTimesRef.set(this.state.selectedDatesTimes)
        .then(() => {
          this.setState({isSaving: false});
          this.props.navigation.goBack();
        }));
    });
  }

  render() {
    return (
      <Fragment>
        <EventDatesTimes
          datesTimesMoments={this.eventObject.datesTimesMoments}
          datesTimesVotes={this.state.datesTimesVotes}
          eventType={Events.INVITED_EVENTS}
          onPressDateTime={this.voteDateTime}
          selectedDatesTimes={this.state.selectedDatesTimes}
        />
        <EventGuestList guests={this.eventObject.guests} />
        <SaveButton
          isSaving={this.state.isSaving}
          onPressSave={this.onPressSave}
        />
      </Fragment>
    );
  }

  voteDateTime(key) {
    this.setState(prevState => {
      let newDatesTimesVotes = {...prevState.datesTimesVotes};
      if (prevState.selectedDatesTimes[key])
        newDatesTimesVotes[key]--;
      else
        newDatesTimesVotes[key]++;

      let newSelectedDatesTimes = {...prevState.selectedDatesTimes};
      newSelectedDatesTimes[key] = !newSelectedDatesTimes[key];

      return {
        datesTimesVotes: newDatesTimesVotes,
        selectedDatesTimes: newSelectedDatesTimes
      };
    });
  }
}

InvitedEventView.propTypes = {
  eventObject: PropTypes.shape({
    id: PropTypes.string.isRequired,
    datesTimesMoments: PropTypes.array.isRequired,
    datesTimesVotes: PropTypes.object.isRequired
  })
};

export default InvitedEventView;
