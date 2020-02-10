import React, {Component, Fragment} from 'react';
import {StyleSheet} from 'react-native';
import {Button, List, Title} from 'react-native-paper';

import firebase from 'react-native-firebase';

import DataList from '~/components/DataList';
import FAB from '~/components/FAB';
import {Routes, Theme} from '~/constants';

class RequestsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAccepted: {},
      isAccepting: {},
      isLoading: false,
      requests: []
    };

    this.accept = this.accept.bind(this);
    this.attachFirebaseListeners = this.attachFirebaseListeners.bind(this);
    this.detachFirebaseListeners = this.detachFirebaseListeners.bind(this);
    this.onAddRequest = this.onAddRequest.bind(this);
    this.onChangeRequest = this.onChangeRequest.bind(this);
    this.onRemoveRequest = this.onRemoveRequest.bind(this);
  }

  attachFirebaseListeners() {
    const user = firebase.auth().currentUser;
    if (!user)
      // THIS SHOULD NEVER HAPPEN
      return;
    
    const database = firebase.database();
    const requestsRef = database.ref(`requests_received/${user.uid}`);
    requestsRef.on('child_added', this.onAddRequest);
    requestsRef.on('child_changed', this.onChangeRequest);
    requestsRef.on('child_removed', this.onRemoveRequest);
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
    
    firebase.database().ref(`requests_received/${user.uid}`).off();
  }

  onAddRequest(snapshot) {
    this.setState({isLoading: true});
    if (!snapshot.exists()) {
      this.setState({isLoading: false});
      return;
    }
    
    let request = snapshot.val();
    request.uid = snapshot.key;
    this.setState(prevState => ({
      requests: [...prevState.requests, request],
      isLoading: false
    }));
  }

  onChangeRequest(snapshot) {
    this.setState(prevState => {
      let newRequests = prevState.requests.slice();
      const index = newRequests.findIndex(request => (
        request.uid === snapshot.key
      ));
      if (index === -1)
        // TODO could this possibly remove all state?
        return;
      
      let changedRequest = snapshot.val();
      changedRequest.uid = snapshot.key;
      newRequests[index] = changedRequest;

      return {requests: newRequests};
    });
  }

  onRemoveRequest(snapshot) {
    this.setState(prevState => ({
      requests: prevState.requests.filter(request => (
        request.uid !== snapshot.key
      ))
    }));
  }

  accept(senderUid, senderName) {
    const user = firebase.auth().currentUser;
    if (!user)
      // THIS SHOULD NEVER HAPPEN
      return;
    
    this.setState(prevState => {
      let isAccepting = {...prevState.isAccepting};
      isAccepting[senderUid] = true;
      return {isAccepting: isAccepting};
    });
    
    const receiverUid = user.uid;
    const database = firebase.database();
    database.ref(`people/${receiverUid}/name`).once('value').then(snapshot => {
      if (!snapshot.exists()) {
        this.setState(prevState => {
          let isAccepting = {...prevState.isAccepting};
          delete isAccepting[senderUid];
          return {isAccepting: isAccepting};
        });
        return;
      }
      
      const receiverName = snapshot.val();

      let updatesObj = {};
      updatesObj[`friends/${receiverUid}/${senderUid}`] = {
        name: senderName
      };
      updatesObj[`friends/${senderUid}/${receiverUid}`] = {
        name: receiverName
      };
      updatesObj[`requests_received/${receiverUid}/${senderUid}`] = null;
      updatesObj[`requests_sent/${senderUid}/${receiverUid}`] = null;
      database.ref().update(updatesObj)
        .then(() => this.setState(prevState => {
          let isAccepted = {...prevState.isAccepted};
          isAccepted[senderUid] = true;
          let isAccepting = {...prevState.isAccepting};
          delete isAccepting[senderUid];

          return {
            isAccepting: isAccepting,
            isAccepted: isAccepted
          };
        }));
    });
  }

  render() {
    return (
      <Fragment>
        <FAB
          onPress={() => this.props.navigation.navigate(Routes.ADD_FRIENDS)}
        />
        <DataList
          data={this.state.requests}
          isLoading={this.state.isLoading}
          keyExtractor={item => item.uid}
          noDataOutput="You have no friend requests."
          renderItem={({item}) => (
            <List.Item
              right={() => (
                <Button
                  disabled={
                    this.state.isAccepting[item.uid] ||
                    this.state.isAccepted[item.uid]
                  }
                  loading={this.state.isAccepting[item.uid]}
                  mode="contained"
                  onPress={() => this.accept(item.uid, item.name)}
                >
                  {this.state.isAccepted[item.uid] ? 'Accepted' : 'Accept'}
                </Button>
              )}
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

export default RequestsView;
