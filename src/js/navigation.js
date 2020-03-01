import React from 'react';
import {IconButton} from 'react-native-paper';

import {createSwitchNavigator} from '@react-navigation/compat';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import {AppBar, AppBarStyle} from '~/components/AppBar';

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

const GoingStack = createStackNavigator();
const GoingNavigator = () => (
  <GoingStack.Navigator headerMode='none'>
    <GoingStack.Screen
      name='GoingMain'
      component={EventsView}
      initialParams={{[Events.EVENTS_TYPE]: Events.GOING_EVENTS}}
    />
  </GoingStack.Navigator>
);

const InvitedStack = createStackNavigator();
const InvitedNavigator = () => (
  <InvitedStack.Navigator headerMode='none'>
    <InvitedStack.Screen
      name='InvitedMain'
      component={EventsView}
      initialParams={{[Events.EVENTS_TYPE]: Events.INVITED_EVENTS}}
    />
  </InvitedStack.Navigator>
);

const HostingStack = createStackNavigator();
const HostingNavigator = () => (
  <HostingStack.Navigator headerMode='none'>
    <HostingStack.Screen
      name='HostingMain'
      component={EventsView}
      initialParams={{[Events.EVENTS_TYPE]: Events.HOSTING_EVENTS}}
    />
  </HostingStack.Navigator>
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

const HomeTopTabs = createMaterialTopTabNavigator();
const HomeTabs = () => (
  <HomeTopTabs.Navigator tabBarOptions={TabBarStyle}>
    <HomeTopTabs.Screen name={Routes.GOING} component={GoingNavigator} />
    <HomeTopTabs.Screen name={Routes.INVITED} component={InvitedNavigator} />
    <HomeTopTabs.Screen name={Routes.HOSTING} component={HostingNavigator} />
  </HomeTopTabs.Navigator>
);

const HomeStack = createStackNavigator();
const HomeNavigator = () => (
  <HomeStack.Navigator
    cardStyle={{backgroundColor: Theme.GRAY}}
    mode='modal'
    screenOptions={{...AppBarStyle, title: Strings.HOME_TITLE}}
  >
    <HomeStack.Screen name='HomeMain' component={HomeTabs} options={AppBar} />
    <HomeStack.Screen name={Routes.CREATE_EVENT} component={CreateEventModal} />
    <HomeStack.Screen name={Routes.EDIT_EVENT} component={EditEventModal} />
    <HomeStack.Screen name={Routes.EVENT_CALENDAR} component={EventCalendarModal} />
    <HomeStack.Screen name={Routes.INVITE_EVENT} component={InviteEventModal} />
    <HomeStack.Screen
      name={Routes.EVENT}
      component={EventView}
      options={({route}) => {
        const eventType = route.params[Events.EVENT_TYPE];
        const isHostView = eventType === Events.HOSTING_EVENTS;
        const onPressDelete = route.params.onPressDelete;
        const onPressEdit = route.params.onPressEdit;
        return {
          headerRight: () => (isHostView && (
            <>
              <IconButton
                color={Theme.WHITE}
                icon='square-edit-outline'
                onPress={onPressEdit}
              />
              <IconButton
                color={Theme.WHITE}
                icon='delete'
                onPress={onPressDelete}
              />
            </>
          )),
          headerRightContainerStyle: {
            flexDirection: 'row'
          },
          title: null
        };
      }}
    />
  </HomeStack.Navigator>
);

const FriendsTopTabs = createMaterialTopTabNavigator();
const FriendsTabs = () => (
  <FriendsTopTabs.Navigator tabBarOptions={TabBarStyle}>
    <FriendsTopTabs.Screen name={Routes.FRIENDS} component={FriendsView} />
    <FriendsTopTabs.Screen name={Routes.REQUESTS} component={RequestsView} />
  </FriendsTopTabs.Navigator>
);

const FriendsStack = createStackNavigator();
const FriendsNavigator = () => (
  <FriendsStack.Navigator
    cardStyle={{backgroundColor: Theme.GRAY}}
    screenOptions={{...AppBarStyle, title: Strings.FRIENDS_TITLE}}
  >
    <FriendsStack.Screen name='FriendsMain' component={FriendsTabs} />
    <FriendsStack.Screen name={Routes.ADD_FRIENDS} component={AddFriendsModal} />
  </FriendsStack.Navigator>
);

const Drawer = createDrawerNavigator();
const AppNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name={Routes.HOME} component={HomeNavigator} />
    <Drawer.Screen name={Routes.FRIENDS} component={FriendsNavigator} />
  </Drawer.Navigator>
);

const AuthStack = createStackNavigator();
const AuthNavigator = () => (
  <AuthStack.Navigator headerMode='none'>
    <AuthStack.Screen name={Routes.SIGN_IN} component={SignInView} />
    <AuthStack.Screen name={Routes.SIGN_UP} component={SignUpView} />
  </AuthStack.Navigator>
);

const RootNavigator = createSwitchNavigator(
  {
    [Routes.AUTH]: AuthNavigator,
    [Routes.APP]: AppNavigator
  }
);

const Navigator = () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

export default Navigator;
