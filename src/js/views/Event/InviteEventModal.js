import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Checkbox, List, Title} from 'react-native-paper';

import firebase from 'react-native-firebase';

import DataList from '~/components/DataList';
import {Strings, Theme} from '~/constants';

class InviteEventModal extends Component {
  static navigationOptions = {
    title: Strings.INVITE_EVENT_TITLE
  };
  
  constructor(props) {
    super(props);
    let selectedObj = {};
    const selectedArray = this.props.navigation.getParam('guests');
    selectedArray.forEach(guest => selectedObj[guest.uid] = true);

    this.state = {
      friends: [],
      isLoading: true,
      selected: selectedObj
    };

    this.onPressInvite = this.onPressInvite.bind(this);
    this.select = this.select.bind(this);
    this.updateGuests = this.props.navigation.getParam('onGuestsChange');
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    if (!user)
      // THIS SHOULD NEVER HAPPEN
      return;
    
    const friendsRef = firebase.database().ref(`friends/${user.uid}`);
    friendsRef.once('value').then(snapshot => {
      if (!snapshot.exists()) {
        this.setState({isLoading: false});
        return;
      }
      
      const friendsObj = snapshot.val();
      const friendsUids = Object.keys(friendsObj);
      let friends = Object.values(friendsObj);
      this.setState(prevState => {
        let selected = prevState.selected;
        friends.forEach((friend, index) => {
          friend.uid = friendsUids[index];
          if (!selected[friend.uid])
            selected[friend.uid] = false;
        });
        friends.sort((a, b) => a.name.localeCompare(b.name));

        return {friends: friends, isLoading: false, selected: selected};
      });
    });
  }

  onPressInvite() {
    const selectedGuests = this.state.friends.filter(friend => (
      this.state.selected[friend.uid]
    ));
    this.updateGuests(selectedGuests);
    this.props.navigation.goBack();
  }

  render() {
    return (
      <DataList
        data={this.state.friends}
        extraData={this.state}
        isLoading={this.state.isLoading}
        keyExtractor={item => item.uid}
        noDataOutput="You have no friends."
        renderItem={({item}) => (
          <List.Item
            right={() => (
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={
                    this.state.selected[item.uid] ? 'checked' : 'unchecked'
                  }
                />
              </View>
            )}
            onPress={() => this.select(item.uid)}
            style={styles.listItem}
            title={<Title>{item.name}</Title>}
          />
        )}
      >
        <Button mode="contained" onPress={this.onPressInvite}>
          Invite
        </Button>
      </DataList>
    );
  }

  select(itemUid) {
    this.setState(prevState => {
      let newSelected = prevState.selected;
      newSelected[itemUid] = !newSelected[itemUid];
      return {selected: newSelected};
    });
  }
}

const styles = StyleSheet.create({
  checkboxContainer: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center'
  },

  listItem: {
    backgroundColor: Theme.WHITE,
    borderBottomWidth: 0.7
  }
});

export default InviteEventModal;
