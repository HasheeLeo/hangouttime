import React from 'react';
import firebase from 'react-native-firebase';
import EventForm from '~/components/Event/EventForm';
import {Strings} from '~/constants';

function onEventCreate(eventObject) {
  const user = firebase.auth().currentUser;
  // THIS SHOULD NEVER HAPPEN
  if (!user)
    return;

  const datesTimes = eventObject.eventDatesTimes.map(dateTime =>
    dateTime.format('YYYY-MM-DD HH:mm')
  );
  let datesAndTimesObj = {};
  datesTimes.forEach(dateAndTime => datesAndTimesObj[dateAndTime] = 0);
  
  const database = firebase.database();
  const newEventRef = database.ref('events').push();
  let updatesObj = {};
  updatesObj[`events/${newEventRef.key}`] = {
    name: eventObject.eventName,
    location: eventObject.eventLocation,
    host: user.uid,
  };

  const description = eventObject.description;
  if (description)
    updatesObj[`events/${newEventRef.key}`].description = description;
  
  updatesObj[`users_hosting/${user.uid}/${newEventRef.key}`] = true;
  updatesObj[`events_datestimes/${newEventRef.key}`] = datesAndTimesObj;
  eventObject.eventGuests.forEach(guest => {
    updatesObj[`events_guests/${newEventRef.key}/${guest.uid}`] = {
      name: guest.name
    };
    updatesObj[`users_invited/${guest.uid}/${newEventRef.key}`] = true;
  });

  return database.ref().update(updatesObj);
}

const CreateEventModal = ({navigation}) => {
  return (
    <EventForm
      actionButtonText={Strings.Event.CREATE_BUTTON}
      navigation={navigation}
      onAction={onEventCreate}
    />
  );
};

CreateEventModal.navigationOptions = {
  title: Strings.CREATE_EVENT_TITLE
};

export default CreateEventModal;
