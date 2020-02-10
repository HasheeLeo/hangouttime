import React, {Component, Fragment} from 'react';
import {Button, List, Searchbar, Title} from 'react-native-paper';

import firebase from 'react-native-firebase';

import {Strings} from '~/constants';
import DataList from '~/components/DataList';

class AddFriendsModal extends Component {
  static navigationOptions = {
    title: Strings.ADD_FRIENDS_TITLE
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isSendingRequest: {},
      isRequestSent: {},
      results: [],
      searchValue: null
    };

    this.add = this.add.bind(this);
    this.search = this.search.bind(this);
  }

  add(receiverUid, receiverName) {
    const sender = firebase.auth().currentUser;
    if (!sender)
      // THIS SHOULD NEVER HAPPEN
      return;
    
    this.setState(prevState => {
      let isSendingRequest = {...prevState.isSendingRequest};
      isSendingRequest[receiverUid] = true;
      return {isSendingRequest: isSendingRequest};
    });

    const senderUid = sender.uid;
    const database = firebase.database();
    database.ref(`people/${sender.uid}/name`).once('value').then(snapshot => {
      if (!snapshot.exists()) {
        this.setState(prevState => {
          let isSendingRequest = {...prevState.isSendingRequest};
          delete isSendingRequest[receiverUid];
          return {isSendingRequest: isSendingRequest};
        });
        return;
      }
      
      const senderName = snapshot.val();

      let updatesObj = {};
      updatesObj[`requests_received/${receiverUid}/${senderUid}`] = {
        name: senderName
      };
      updatesObj[`requests_sent/${senderUid}/${receiverUid}`] = {
        name: receiverName
      };
      database.ref().update(updatesObj)
        .then(() => this.setState(prevState => {
          let isRequestSent = {...prevState.isRequestSent};
          isRequestSent[receiverUid] = true;
          let isSendingRequest = {...prevState.isSendingRequest};
          delete isSendingRequest[receiverUid];

          return {
            isSendingRequest: isSendingRequest,
            isRequestSent: isRequestSent
          };
        }));
    });
  }

  render() {
    return (
      <Fragment>
        <Searchbar
          autoFocus={true}
          onChangeText={text => this.setState({searchValue: text})}
          onSubmitEditing={this.search}
          placeholder="e.g. John Doe"
          value={this.state.searchValue}
        />
        <DataList
          data={this.state.results}
          isLoading={this.state.isLoading}
          keyExtractor={item => item.uid}
          noDataOutput="No results."
          renderItem={({item}) => (
            <List.Item
              right={() => (
                <Button
                  disabled={
                    this.state.isSendingRequest[item.uid] ||
                    this.state.isRequestSent[item.uid]
                  }
                  loading={this.state.isSendingRequest[item.uid]}
                  mode="contained"
                  onPress={() => this.add(item.uid, item.name)}
                >
                  {this.state.isRequestSent[item.uid] ? 'Request Sent' : 'Add'}
                </Button>
              )}
              title={<Title>{item.name}</Title>}
            />
          )}
        />
      </Fragment>
    );
  }

  search() {
    if (!this.state.searchValue) {
      this.setState({isLoading: false, results: []});
      return;
    }
    
    const user = firebase.auth().currentUser;
    if (!user)
      // THIS SHOULD NEVER HAPPEN
      return;
    
    this.setState({results: []});
    const database = firebase.database();
    const query = database.ref('people').orderByChild('name')
      .startAt(this.state.searchValue.toUpperCase())
      .endAt(this.state.searchValue.toLowerCase() + '\uf8ff');
    
    query.once('child_added', snapshot => {
      this.setState({isLoading: true});
      let person = snapshot.val();
      person.uid = snapshot.key;
      if (user.uid === person.uid) {
        this.setState({isLoading: false});
        return;
      }

      const isRequestSentPath = `requests_sent/${user.uid}/${person.uid}`;
      database.ref(isRequestSentPath).once('value').then(snapshot => {
        if (snapshot.exists()) {
          this.setState({isLoading: false});
        }
        
        else {
          const isFriendPath = `friends/${user.uid}/${person.uid}`;
          database.ref(isFriendPath).once('value').then(snapshot => {
            if (snapshot.exists())
              this.setState({isLoading: false});
            
            else
              this.setState(prevState => ({
                results: [...prevState.results, person]
              }));
          });
        }
      });
    });
  }
}

export default AddFriendsModal;
