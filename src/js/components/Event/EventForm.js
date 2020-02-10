import React, {Component} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Button,
  Card,
  Chip,
  TextInput,
  Title
} from 'react-native-paper';

import {MomentFormat, Routes} from '~/constants';

const CHIP_DATETIME = 0;
const CHIP_GUEST = 1;

class EventForm extends Component {
  constructor(props) {
    super(props);
    this.inputs = {};
    const eventObject = this.props.eventObject;
    this.state = {
      eventName: eventObject ? eventObject.name : null,
      eventDescription: eventObject ? eventObject.description : null,
      eventLocation: eventObject ? eventObject.location : null,
      eventDatesTimes: eventObject ? eventObject.datesTimesMoments : [],
      eventGuests: eventObject ? eventObject.guests : [],
      error: false,
      isDoingAction: false
    };

    this.focusNext = this.focusNext.bind(this);
    this.onChipClose = this.onChipClose.bind(this);
    this.onPressAction = this.onPressAction.bind(this);
    this.updateEventDatesTimes = this.updateEventDatesTimes.bind(this);
    this.updateEventGuests = this.updateEventGuests.bind(this);
  }

  focusNext(input) {
    this.inputs[input].focus();
  }

  onChipClose(chip, type) {
    if (type === CHIP_DATETIME)
      this.setState(prevState => ({
        eventDatesTimes: prevState.eventDatesTimes.filter(dateTime =>
          dateTime !== chip
        )
      }));
    else
      this.setState(prevState => ({
        eventGuests: prevState.eventGuests.filter(guest => guest !== chip)
      }));
  }

  onPressAction() {
    if (!this.state.eventName || !this.state.eventLocation ||
      this.state.eventDatesTimes.length <= 0) {
      this.setState({error: true});
      return;
    }

    this.setState({error: false, isDoingAction: true});
    const oldEventObject = this.props.eventObject;
    const eventObject = {
      id: oldEventObject ? oldEventObject.id : undefined,
      eventName: this.state.eventName,
      eventDescription: this.state.eventDescription,
      eventLocation: this.state.eventLocation,
      eventDatesTimes: this.state.eventDatesTimes,
      eventGuests: this.state.eventGuests,
      eventOldGuests: oldEventObject ? oldEventObject.guests : undefined
    };
    this.props.onAction(eventObject)
      .then(() => this.props.navigation.goBack());
  }

  render() {
    const datesTimes = this.state.eventDatesTimes.map(dateTime => (
      <Chip
        key={dateTime.format('DD-MM-YYYY')}
        onClose={() => this.onChipClose(dateTime, CHIP_DATETIME)}
        style={styles.chip}
      >
        {dateTime.calendar(null, MomentFormat)}
      </Chip>
    ));

    const guests = this.state.eventGuests.map(guest => (
      <Chip
        key={guest.uid}
        onClose={() => this.onChipClose(guest, CHIP_GUEST)}
        style={styles.chip}
      >
        {guest.name}
      </Chip>
    ));

    return (
      <ScrollView>
        <Card elevation={3} style={styles.card}>
          <Card.Content>
            <Title>Basic Info</Title>
            <TextInput
              autoCapitalize="words"
              autoFocus={true}
              blurOnSubmit={false}
              error={this.state.error}
              label="Name"
              onChangeText={text => this.setState({eventName: text})}
              onSubmitEditing={() => this.focusNext('2')}
              returnKeyType="next"
              style={styles.formElem}
              value={this.state.eventName}
            />
            <TextInput
              label="Description"
              multiline={true}
              onChangeText={text => this.setState({eventDescription: text})}
              ref={input => this.inputs['2'] = input}
              style={[styles.formElem, styles.description]}
              value={this.state.eventDescription}
            />
            <TextInput
              autoCapitalize="words"
              error={this.state.error}
              label="Location"
              onChangeText={text => this.setState({eventLocation: text})}
              returnKeyType="done"
              style={styles.formElem}
              value={this.state.eventLocation}
            />
            <Title>Dates and Times</Title>
            <View style={styles.chipContainer}>
              {datesTimes}
            </View>
            <Button
              icon="add"
              onPress={() => (
                this.props.navigation.navigate(Routes.EVENT_CALENDAR, {
                  'selectedDatesTimes': this.state.eventDatesTimes,
                  'onDatesTimesChange': this.updateEventDatesTimes
                })
              )}
              style={styles.modalOpenerButton}
            >
              Add
            </Button>
            <Title style={styles.guestsTitle}>Guests</Title>
            <View style={styles.chipContainer}>
              {guests}
            </View>
            <Button
              icon="mail-outline"
              onPress={() => (
                this.props.navigation.navigate(Routes.INVITE_EVENT, {
                  'guests': this.state.eventGuests,
                  'onGuestsChange': this.updateEventGuests
                })
              )}
              style={styles.modalOpenerButton}
            >
              Invite
            </Button>
            <Button
              disabled={this.state.isDoingAction}
              loading={this.state.isDoingAction}
              mode="contained"
              onPress={this.onPressAction}
              style={styles.actionButton}
            >
              {this.props.actionButtonText}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  updateEventDatesTimes(datesAndTimes) {
    this.setState({eventDatesTimes: datesAndTimes});
  }

  updateEventGuests(guests) {
    this.setState({eventGuests: guests});
  }
}

const styles = StyleSheet.create({
  actionButton: {
    marginTop: 25
  },

  card: {
    margin: 5
  },

  chip: {
    marginRight: 2,
    marginVertical: 2
  },

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 5
  },

  description: {
    minHeight: 80
  },

  formElem: {
    marginVertical: 5
  },

  guestsTitle: {
    marginTop: 10
  },

  modalOpenerButton: {
    alignSelf: 'flex-start'
  }
});

export default EventForm;
