import React, {Component} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Button, HelperText, Text, TextInput} from 'react-native-paper';

import firebase from '@react-native-firebase/app';

import {Routes, Strings, Theme} from '~/constants';

class SignInView extends Component {
  constructor(props) {
    super(props);
    this.inputs = {};
    this.state = {
      email: null,
      password: null,
      helperText: null,
      isHelperTextVisible: false,
      isLoading: false
    };

    this.focusNext = this.focusNext.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  componentDidMount() {
    this.removeAuthStateObserver = firebase.auth().onAuthStateChanged(user => {
      if (user)
        this.props.navigation.navigate(Routes.APP);
    });
  }

  componentWillUnmount() {
    if (this.removeAuthStateObserver)
      this.removeAuthStateObserver();
  }

  focusNext(input) {
    this.inputs[input].focus();
  }

  render() {
    return (
      <View style={styles.container}>
        <HelperText
          style={styles.helperText}
          visible={this.state.isHelperTextVisible}
        >
          {this.state.helperText}
        </HelperText>
        <View style={styles.appLogoContainer}>
          <Image source={require('%/logo.png')} style={styles.appLogo} />
          <Text style={styles.appName}>{Strings.APP_NAME}</Text>
        </View>
        <View style={styles.formContainer}>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            autoFocus={true}
            blurOnSubmit={false}
            error={!this.state.email && this.state.isHelperTextVisible}
            keyboardType="email-address"
            label="Email"
            onChangeText={text => this.setState({email: text})}
            onSubmitEditing={() => this.focusNext('2')}
            returnKeyType="next"
            style={styles.formElement}
            value={this.state.email}
          />
          <TextInput
            autoCapitalize="none"
            autoComplete="password"
            error={!this.state.password && this.state.isHelperTextVisible}
            label="Password"
            onChangeText={text => this.setState({password: text})}
            onSubmitEditing={this.signIn}
            secureTextEntry={true}
            ref={input => this.inputs['2'] = input}
            returnKeyType="done"
            style={styles.formElement}
            value={this.state.password}
          />
          <Button
            disabled={this.state.isLoading}
            loading={this.state.isLoading}
            onPress={this.signIn}
            mode="contained"
            style={styles.signInButton}
          >
            Sign In
          </Button>

          <Button
            color={Theme.WHITE}
            onPress={() => this.props.navigation.navigate(Routes.SIGN_UP)}
          >
            Create a New Account
          </Button>
        </View>
      </View>
    );
  }

  signIn() {
    if (this.state.isLoading)
      return;

    if (!this.state.email || !this.state.password) {
      this.setState({
        helperText: Strings.MISSING_INPUT,
        isHelperTextVisible: true
      });
      return;
    }

    this.setState({
      helperText: null,
      isHelperTextVisible: false,
      isLoading: true
    });

    firebase.auth().signInWithEmailAndPassword(
      this.state.email, this.state.password
    )
    .catch(error => {
      const errorCode = error.code;
      let helperText;
      if (errorCode === 'auth/invalid-email' ||
        errorCode === 'auth/invalid-password' ||
        errorCode === 'auth/user-not-found')
        helperText = Strings.Auth.INVALID_CREDENTIALS;
      else
        helperText = Strings.NETWORK_ERROR;

      this.setState({
        helperText: helperText,
        isHelperTextVisible: true,
        isLoading: false
      });
    });
  }
}

const styles = StyleSheet.create({
  appLogo: {
    alignSelf: 'center'
  },

  appLogoContainer: {
    flex: 1,
    justifyContent: 'center'
  },

  appName: {
    alignSelf: 'center',
    color: Theme.WHITE,
    fontSize: 21
  },

  container: {
    backgroundColor: Theme.PRIMARY,
    flex: 1
  },

  formContainer: {
    flex: 1.6,
    justifyContent: 'flex-start',
    marginHorizontal: 30
  },

  formElement: {
    marginBottom: 5
  },

  helperText: {
    backgroundColor: Theme.ERROR,
    color: Theme.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },

  signInButton: {
    alignSelf: 'center',
    backgroundColor: Theme.PRIMARY_DARK,
    marginTop: 15,
    marginBottom: 20
  }
});

export default SignInView;
