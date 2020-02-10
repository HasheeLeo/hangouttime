import React, {Component} from 'react';
import {ScrollView, StyleSheet, TouchableHighlight, View} from 'react-native';
import {Button, Card, Text} from 'react-native-paper';
import {Calendar} from 'react-native-calendars';
import DateTimePicker from 'react-native-modal-datetime-picker';

import moment from 'moment';

import {Strings, Theme} from '~/constants';

class EventCalendarModal extends Component {
  static navigationOptions = {
    title: Strings.EVENT_CALENDAR_TITLE
  };
  
  constructor(props) {
    super(props);
    this.state = {
      isTimePickerVisible: false,
      selectedDatesTimes: this.props.navigation.getParam('selectedDatesTimes')
    };

    this.curDateIndex = null;

    this.buildMarkedDatesObject = this.buildMarkedDatesObject.bind(this);
    this.onCancelTimePicker = this.onCancelTimePicker.bind(this);
    this.onConfirmTimePicker = this.onConfirmTimePicker.bind(this);
    this.onPressDay = this.onPressDay.bind(this);
    this.onPressSave = this.onPressSave.bind(this);
    this.onPressTime = this.onPressTime.bind(this);

    this.onDatesTimesChange = this.props.navigation.getParam(
      'onDatesTimesChange'
    );
  }

  buildMarkedDatesObject() {
    let markedDates = {};
    for (const date of this.state.selectedDatesTimes)
      markedDates[date.format('YYYY-MM-DD')] = {selected: true};

    return markedDates;
  }

  onPressDay(day) {
    if (this.state.selectedDatesTimes.length > 0
      && this.state.selectedDatesTimes.some(dateTime => (
        dateTime.format('YYYY-MM-DD') === day.dateString)))
    {
      this.setState(prevState => ({
        selectedDatesTimes: prevState.selectedDatesTimes.filter(dateTime => (
          dateTime.format('YYYY-MM-DD') !== day.dateString))
      }));
    }
    else
    {
      this.setState(prevState => ({
        selectedDatesTimes: [
          ...prevState.selectedDatesTimes,
          moment(day.dateString)
        ]
      }));
    }
  }

  onPressSave() {
    this.onDatesTimesChange(this.state.selectedDatesTimes);
    this.props.navigation.goBack();
  }

  onCancelTimePicker() {
    this.curDateIndex = null;
    this.setState({isTimePickerVisible: false});
  }

  onConfirmTimePicker(time) {
    const timeMoment = moment(time);
    this.setState(prevState => {
      let dateMoment = moment(prevState.selectedDatesTimes[this.curDateIndex]);
      dateMoment.hour(timeMoment.hour());
      dateMoment.minute(timeMoment.minute());
      let newSelectedDatesTimes = prevState.selectedDatesTimes.slice();
      newSelectedDatesTimes[this.curDateIndex] = dateMoment;

      return {selectedDatesTimes: newSelectedDatesTimes};
    });
    this.onCancelTimePicker();
  }

  onPressTime(dateIndex) {
    this.curDateIndex = dateIndex;
    this.setState({isTimePickerVisible: true});
  }

  render() {
    const dates = this.state.selectedDatesTimes.map(date => (
      <Text key={date.format('DD-MM-YYYY')} style={styles.dateTimeText}>
        {date.calendar(null, {
          sameDay: '[Today]',
          nextDay: '[Tomorrow]',
          nextWeek: 'dddd'
        })}
      </Text>
    ));

    const times = this.state.selectedDatesTimes.map((date, index) => (
      <TouchableHighlight
        key={date.format('DD-MM-YYYY H:m:s')}
        onPress={() => this.onPressTime(index)}
        underlayColor={Theme.GRAY_DARK}
      >
        <Text style={{...styles.dateTimeText, ...styles.timeButton}}>
          {date.format('hh:mm A')}
        </Text>
      </TouchableHighlight>
    ));
    
    return (
      <ScrollView style={styles.container}>
        <Card elevation={3}>
          <Calendar
            markedDates={this.buildMarkedDatesObject()}
            minDate={Date()}
            onDayPress={this.onPressDay}
            theme={{
              arrowColor: Theme.ACCENT,
              dayTextColor: Theme.BLACK,
              monthTextColor: Theme.BLACK,
              selectedDayBackgroundColor: Theme.PRIMARY,
              todayTextColor: Theme.PRIMARY,
              textSectionTitleColor: Theme.GRAY_DARK
            }}
          />

          <Card.Content>
            <View style={styles.datesTimesContainer}>
              <View>
                {dates}
              </View>

              <View>
                {times}
              </View>
            </View>

            <Button
              mode="contained"
              onPress={this.onPressSave}
            >
              Save
            </Button>
          </Card.Content>
        </Card>

        <DateTimePicker
          isVisible={this.state.isTimePickerVisible}
          mode="time"
          onCancel={this.onCancelTimePicker}
          onConfirm={this.onConfirmTimePicker}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 5
  },

  datesTimesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20
  },

  dateTimeText: {
    fontSize: 16,
    marginVertical: 3
  },

  timeButton: {
    color: Theme.ACCENT,
    fontWeight: 'bold'
  }
});

export default EventCalendarModal;
