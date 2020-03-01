import React, {Component, Fragment} from 'react';
import {StyleSheet} from 'react-native';
import {List, Title} from 'react-native-paper';
import firebase from '@react-native-firebase/app';

import DataList from '~/components/DataList';
import FAB from '~/components/FAB';
import {Routes, Theme} from '~/constants';

class FriendsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      isLoading: false
    };

    this.attachFirebaseListeners = this.attachFirebaseListeners.bind(this);
    this.detachFirebaseListeners = this.detachFirebaseListeners.bind(this);
    this.onAddFriend = this.onAddFriend.bind(this);
    this.onChangeFriend = this.onChangeFriend.bind(this);
    this.onRemoveFriend = this.onRemoveFriend.bind(this);
  }

  attachFirebaseListeners() {
    const user = firebase.auth().currentUser;
    if (!user)
      // THIS SHOULD NEVER HAPPEN
      return;

    const friendsRef = firebase.database().ref(`friends/${user.uid}`);
    friendsRef.on('child_added', this.onAddFriend);
    friendsRef.on('child_changed', this.onChangeFriend);
    friendsRef.on('child_removed', this.onRemoveFriend);
  }

  componentDidMount() {
    this.attachFirebaseListeners();
  }

  componentWillUnmount() {
    this.detachFirebaseListeners();
  }

  detachFirebaseListeners() {
    const user = firebase.auth().currentUser;
    if (!user)
      // THIS SHOULD NEVER HAPPEN
      return;

    firebase.database().ref(`friends/${user.uid}`).off();
  }

  onAddFriend(snapshot) {
    this.setState({isLoading: true});
    if (!snapshot.exists()) {
      this.setState({isLoading: false});
      return;
    }

    let friend = snapshot.val();
    friend.uid = snapshot.key;
    this.setState(prevState => ({
      friends: [...prevState.friends, friend],
      isLoading: false
    }));
  }

  onChangeFriend(snapshot) {
    this.setState(prevState => {
      let newFriends = prevState.friends.slice();
      const index = newFriends.findIndex(friend => friend.uid === snapshot.key);
      if (index === -1)
        // TODO could this possibly remove all state?
        return;

      let changedFriend = snapshot.val();
      changedFriend.uid = snapshot.key;
      newFriends[index] = changedFriend;

      return {friends: newFriends};
    });
  }

  onRemoveFriend(snapshot) {
    this.setState(prevState => ({
      friends: prevState.friends.filter(friend => friend.uid !== snapshot.key)
    }));
  }

  render() {
    return (
      <Fragment>
        <FAB
          onPress={() => this.props.navigation.navigate(Routes.ADD_FRIENDS)}
        />
        <DataList
          data={this.state.friends}
          keyExtractor={item => item.uid}
          noDataOutput="You have no friends."
          renderItem={({item}) => (
            <List.Item
              style={styles.listItem}
              title={<Title>{item.name}</Title>}
            />
          )}
        />
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: Theme.WHITE,
    borderBottomWidth: 0.7
  }
});

export default FriendsView;
