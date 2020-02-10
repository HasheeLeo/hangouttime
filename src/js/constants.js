export const Events = {
  EVENTS_TYPE: 'EventsType',
  EVENT_TYPE: 'EventType',
  GOING_EVENTS: 'GoingEvents',
  INVITED_EVENTS: 'InvitedEvents',
  HOSTING_EVENTS: 'HostingEvents',

  EVENT_OBJECT: 'EventObject'
};

export const MomentFormat = {
  sameDay: '[Today] hh:mm A',
  nextDay: '[Tomorrow] hh:mm A',
  nextWeek: 'dddd hh:mm A',
  sameElse: 'DD/MM/YYYY hh:mm A'
};

export const Routes = {
  AUTH: 'Auth',
  SIGN_IN: 'SignIn',
  SIGN_UP: 'SignUp',
  APP: 'App',

  HOME: 'Home',
  GOING: 'Going',
  INVITED: 'Pending',
  HOSTING: 'Hosting',
  EVENT: 'Event',
  CREATE_EVENT: 'CreateEvent',
  EDIT_EVENT: 'EditEvent',
  EVENT_CALENDAR: 'EventCalendar',
  INVITE_EVENT: 'InviteEvent',

  PROFILE: 'Profile',
  FRIENDS: 'Friends',
  REQUESTS: 'Requests',
  ADD_FRIENDS: 'AddFriends',
  SETTINGS: 'Settings'
};

export const Strings = {
  APP_NAME: 'Hangout Time',
  HOME_TITLE: 'Home',
  CREATE_EVENT_TITLE: 'Create New Event',
  EDIT_EVENT_TITLE: 'Edit Event',
  EVENT_CALENDAR_TITLE: 'Event Dates and Times',
  INVITE_EVENT_TITLE: 'Invite Friends',
  FRIENDS_TITLE: 'Friends',
  ADD_FRIENDS_TITLE: 'Add a Friend',

  Actions: {
    CANCEL: 'Cancel',
    CONFIRM: 'Confirm',
    DELETE: 'Delete',
    SAVE: 'Save'
  },

  Alpha: {
    ALERT_TITLE: 'Welcome',
    ALERT_MSG: 'Thank you for taking part in the alpha testing of Hangout ' + 
      'Time. Please let us know of any and every glitch, problem or ' +
      'suggestion you have, and email it to hashir@hashirahmad.com. Your ' +
      'help to improve this app is very appreciated.'
  },

  Auth: {
    EMAIL_IN_USE: 'An account already exists with the provided email address.',
    INVALID_CREDENTIALS: 'Your username and/or password is incorrect.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    PASSWORDS_DONT_MATCH: 'The passwords do not match.',
    PASSWORD_MIN_ERROR: 'Your password must be at least 8 characters long.'
  },

  Event: {
    CREATE_BUTTON: 'Create Event',
    DELETE_TITLE: 'Delete Event?',
    DELETE_MSG: 'Are you sure you want to delete '
  },

  MISSING_INPUT: 'Please fill in the required fields.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.'
};

export const Theme = {
  PRIMARY: '#3D9A41',
  PRIMARY_DARK: '#388E3C',
  ACCENT: '#3D9A41',
  ERROR: '#FF0000',
  GRAY: '#DDDDDD',
  GRAY_DARK: '#BDBDBD',
  BLACK: 'black',
  WHITE: 'white'
};
