import React, {Component, Fragment} from 'react';

import firebase from '@react-native-firebase/app';
import PropTypes from 'prop-types';

import SaveButton from '~/components/SaveButton';
import EventDatesTimes from '~/components/Event/EventDatesTimes';
import EventGuestList from '~/components/Event/EventGuestList';

import {Events} from '~/constants';

class HostingEventView extends Component {
  constructor(props) {
    super(props);
    this.eventObject = this.props.eventObject;
    this.selectedDateTimeKey = null;

    this.state = {
      isSaving: false,
      selectedDateTime: {}
    };

    this.onPressSave = this.onPressSave.bind(this);
    this.selectDateTime = this.selectDateTime.bind(this);
  }

  componentDidMount() {
    const database = firebase.database();
    const finalDateTimePath = `events/${this.eventObject.id}/finalDateTime`;
    database.ref(finalDateTimePath).once('value', snapshot => {
      if (!snapshot.exists())
        return;

      const selectedDateTimeKey = snapshot.val();
      this.selectedDateTimeKey = selectedDateTimeKey;
      let newSelectedDateTime = {};
      newSelectedDateTime[selectedDateTimeKey] = true;
      this.setState({selectedDateTime: newSelectedDateTime});
    });
  }

  onPressSave() {
    // No selected date
    if (!this.selectedDateTimeKey)
      return;

    this.setState({isSaving: true});
    const database = firebase.database();
    const guestsRef = database.ref(`events_guests/${this.eventObject.id}`);
    let updatesObj = {};
    guestsRef.once('value').then(snapshot => {
      if (!snapshot.exists()) {
        this.setState({isSaving: false});
        return;
      }

      const userIds = snapshot.val();
      for (const userId in userIds) {
        if (!userIds.hasOwnProperty(userId))
          continue;

        updatesObj[`users_datestimes/${userId}/${this.eventObject.id}`] = null;
        updatesObj[`users_going/${userId}/${this.eventObject.id}`] = true;
        updatesObj[`users_invited/${userId}/${this.eventObject.id}`] = null;
      }

      const finalDateTimePath = `events/${this.eventObject.id}/finalDateTime`;
      updatesObj[finalDateTimePath] = this.selectedDateTimeKey;
      database.ref().update(updatesObj)
        .then(() => {
          this.setState({isSaving: false});
          this.props.navigation.goBack();
        });
    });
  }

  render() {
    return (
      <Fragment>
        <EventDatesTimes
          datesTimesMoments={this.eventObject.datesTimesMoments}
          datesTimesVotes={this.eventObject.datesTimesVotes}
          eventType={Events.HOSTING_EVENTS}
          onPressDateTime={this.selectDateTime}
          selectedDatesTimes={this.state.selectedDateTime}
        />
        <EventGuestList guests={this.eventObject.guests} />
        <SaveButton
          isSaving={this.state.isSaving}
          onPressSave={this.onPressSave}
        />
      </Fragment>
    );
  }

  selectDateTime(key) {
    this.selectedDateTimeKey = key;
    let newSelectedDateTime = {};
    newSelectedDateTime[key] = true;
    this.setState({selectedDateTime: newSelectedDateTime});
  }
}

HostingEventView.propTypes = {
  eventObject: PropTypes.shape({
    id: PropTypes.string.isRequired,
    datesTimesMoments: PropTypes.array.isRequired,
    datesTimesVotes: PropTypes.object.isRequired
  })
};

export default HostingEventView;
