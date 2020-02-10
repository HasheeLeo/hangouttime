import React from 'react';
import {Drawer} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  createAppContainer,
  createDrawerNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator,
  createSwitchNavigator
} from 'react-navigation';

import {AppBar, AppBarStyle} from '~/components/AppBar';
import DrawerComponent from '~/components/DrawerComponent';

import SignInView from '~/views/SignInView';
import SignUpView from '~/views/SignUpView';

import EventsView from '~/views/Event/EventsView';
import EventView from '~/views/Event/EventView/EventView';
import CreateEventModal from '~/views/Event/CreateEventModal';
import EditEventModal from '~/views/Event/EditEventModal';
import EventCalendarModal from '~/views/Event/EventCalendarModal';
import InviteEventModal from '~/views/Event/InviteEventModal';

import FriendsView from '~/views/Friend/FriendsView';
import RequestsView from '~/views/Friend/RequestsView';
import AddFriendsModal from '~/views/Friend/AddFriendsModal';

import {Events, Routes, Strings, Theme} from '~/constants';

const GoingNavigator = createStackNavigator(
  {
    GoingMain: {
      screen: EventsView,
      params: {[Events.EVENTS_TYPE]: Events.GOING_EVENTS}
    }
  },
  {
    headerMode: 'none'
  }
);

const InvitedNavigator = createStackNavigator(
  {
    InvitedMain: {
      screen: EventsView,
      params: {[Events.EVENTS_TYPE]: Events.INVITED_EVENTS}
    }
  },
  {
    headerMode: 'none'
  }
);

const HostingNavigator = createStackNavigator(
  {
    HostingMain: {
      screen: EventsView,
      params: {[Events.EVENTS_TYPE]: Events.HOSTING_EVENTS}
    }
  },
  {
    headerMode: 'none'
  }
);

const TabBarStyle = {
  indicatorStyle: {
    backgroundColor: Theme.WHITE
  },

  labelStyle: {
    color: Theme.WHITE
  },

  style: {
    backgroundColor: Theme.PRIMARY
  }
};

const HomeTabs = createMaterialTopTabNavigator(
  {
    [Routes.GOING]: GoingNavigator,
    [Routes.INVITED]: InvitedNavigator,
    [Routes.HOSTING]: HostingNavigator
  },
  {
    tabBarOptions: TabBarStyle
  }
);

const HomeNavigator = createStackNavigator(
  {
    HomeMain: {
      screen: HomeTabs,
      navigationOptions: AppBar
    },
    [Routes.CREATE_EVENT]: CreateEventModal,
    [Routes.EDIT_EVENT]: EditEventModal,
    [Routes.EVENT_CALENDAR]: EventCalendarModal,
    [Routes.INVITE_EVENT]: InviteEventModal,

    [Routes.EVENT]: EventView
  },
  {
    cardStyle: {
      backgroundColor: Theme.GRAY
    },
    defaultNavigationOptions: {
      ...AppBarStyle,
      title: Strings.HOME_TITLE
    },
    mode: 'modal'
  }
);

const FriendsTabs = createMaterialTopTabNavigator(
  {
    [Routes.FRIENDS]: FriendsView,
    [Routes.REQUESTS]: RequestsView
  },
  {
    tabBarOptions: TabBarStyle
  }
);

const FriendsNavigator = createStackNavigator(
  {
    FriendsMain: {
      screen: FriendsTabs,
      navigationOptions: AppBar
    },
    [Routes.ADD_FRIENDS]: AddFriendsModal
  },
  {
    cardStyle: {
      backgroundColor: Theme.GRAY
    },
    defaultNavigationOptions: {
      ...AppBarStyle,
      title: Strings.FRIENDS_TITLE
    },
    mode: 'modal'
  }
);

const AppNavigator = createDrawerNavigator(
  {
    [Routes.HOME]: {
      screen: HomeNavigator,
      navigationOptions: {
        drawerIcon: ({tintColor}) => (
          <MaterialIcons
            color={tintColor}
            name="home"
            size={25}
          />
        ),
        drawerLabel: ({focused}) => (
          <Drawer.Item
            active={focused}
            label="Home"
            style={{backgroundColor: 'transparent'}}
          />
        )
      }
    },
    [Routes.FRIENDS]: {
      screen: FriendsNavigator,
      navigationOptions: {
        drawerIcon: ({tintColor}) => (
          <MaterialIcons
            color={tintColor}
            name="group"
            size={25}
          />
        ),
        drawerLabel: ({focused}) => (
          <Drawer.Item
            active={focused}
            label="Friends"
            style={{backgroundColor: 'transparent'}}
          />
        )
      }
    },
  },
  {
    contentComponent: DrawerComponent,
    contentOptions: {
      activeBackgroundColor: Theme.GRAY,
      activeTintColor: Theme.PRIMARY
    },
    defaultNavigationOptions: ({navigation}) => {
      // Disable drawer opening gesture on other screens
      let drawerLockMode = 'unlocked';
      if (navigation.state.index > 0)
        drawerLockMode = 'locked-closed';
      
      return {drawerLockMode};
    }
  }
);

const AuthNavigator = createStackNavigator(
  {
    [Routes.SIGN_IN]: SignInView,
    [Routes.SIGN_UP]: SignUpView
  },
  {
    headerMode: 'none'
  }
);

const RootNavigator = createSwitchNavigator(
  {
    [Routes.AUTH]: AuthNavigator,
    [Routes.APP]: AppNavigator
  }
);

const AppContainer = createAppContainer(RootNavigator);
export default AppContainer;
