import React from 'react';
import firebase from 'react-native-firebase';
import EventForm from '~/components/Event/EventForm';
import {Events, Strings} from '~/constants';

function onEventEdit(eventObject) {
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
  let updatesObj = {};
  updatesObj[`events/${eventObject.id}`] = {
    name: eventObject.eventName,
    description: eventObject.eventDescription,
    location: eventObject.eventLocation,
    host: user.uid,
  };
  updatesObj[`users_hosting/${user.uid}/${eventObject.id}`] = true;
  updatesObj[`events_datestimes/${eventObject.id}`] = datesAndTimesObj;

  let deletedEventGuests = eventObject.eventOldGuests;
  eventObject.eventGuests.forEach(guest => {
    const index = deletedEventGuests.find(oldGuest => (
      oldGuest.uid === guest.uid
    ));
    if (index !== undefined) {
      deletedEventGuests.splice(index, 1);
    }
    else {
      updatesObj[`events_guests/${eventObject.id}/${guest.uid}`] = {
        name: guest.name
      };
      updatesObj[`users_invited/${guest.uid}/${eventObject.id}`] = true;
    }
  });

  deletedEventGuests.forEach(byebyeGuest => {
    updatesObj[`events_guests/${eventObject.id}/${byebyeGuest.uid}`] = null;
    updatesObj[`users_invited/${byebyeGuest.uid}/${eventObject.id}`] = null;
  });
  return database.ref().update(updatesObj);
}

const CreateEventModal = ({navigation}) => {
  return (
    <EventForm
      actionButtonText={Strings.Actions.SAVE}
      eventObject={navigation.getParam(Events.EVENT_OBJECT)}
      navigation={navigation}
      onAction={onEventEdit}
    />
  );
};

CreateEventModal.navigationOptions = {
  title: Strings.EDIT_EVENT_TITLE
};

export default CreateEventModal;
