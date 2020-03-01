import React, {Component} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {Drawer, Title} from 'react-native-paper';
import MaterialCommunityIcons
  from 'react-native-vector-icons/MaterialCommunityIcons';

import firebase from '@react-native-firebase/app';

import {Routes, Theme} from '~/constants';

class DrawerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null
    };

    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    if (user) {
      const usersRef = firebase.database().ref(`users/${user.uid}/name`);
      usersRef.once('value').then(snapshot => {
        if (!snapshot.exists())
          return;

        const name = snapshot.val();
        this.setState({name: name});
      });
    }
  }

  logout() {
    firebase.auth().signOut()
      .then(() => this.props.navigation.navigate(Routes.AUTH))
      .catch(() => console.log('Failed'));
  }

  render() {
    if (!this.state.name)
      return null;

    return (
      <ScrollView>
        <SafeAreaView
          forceInset={{top: 'always', horizontal: 'never'}}
          style={styles.container}
        >
          <View style={styles.titleContainer}>
            <Title style={{color: Theme.WHITE}}>{this.state.name}</Title>
          </View>
          {/*<DrawerItems {...this.props} />*/}
          {/*<Drawer.Item
            icon={({color, size}) => (
              <MaterialCommunityIcons color={color} name="logout" size={size} />
            )}*
            label="Sign Out"
            onPress={this.logout}
            style={{marginVertical: 0}}
          />*/}
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  titleContainer: {
    backgroundColor: Theme.PRIMARY,
    paddingLeft: 20,
    paddingVertical: 20
  }
});

export default DrawerComponent;
