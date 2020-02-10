import React, {Component} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Button, HelperText, Text, TextInput} from 'react-native-paper';

import firebase from 'react-native-firebase';

import {Routes, Strings, Theme} from '~/constants';

const PASSWORD_MIN_LEN = 8;

class SignUpView extends Component {
  constructor(props) {
    super(props);
    this.inputs = {};
    this.state = {
      fullName: null,
      email: null,
      password: null,
      confirmPassword: null,
      helperText: null,
      isHelperTextVisible: false,
      isLoading: false
    };

    this.focusNext = this.focusNext.bind(this);
    this.signUp = this.signUp.bind(this);
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
        <View style={styles.gutter}></View>
        <View style={styles.formContainer}>
          <TextInput
            autoCapitalize="words"
            autoComplete="name"
            autoFocus={true}
            blurOnSubmit={false}
            error={!this.state.fullName && this.state.isHelperTextVisible}
            label="Full Name"
            onChangeText={text => this.setState({fullName: text})}
            onSubmitEditing={() => this.focusNext('2')}
            returnKeyType="next"
            style={styles.formElement}
            value={this.state.fullName}
          />
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            blurOnSubmit={false}
            error={!this.state.email && this.state.isHelperTextVisible}
            keyboardType="email-address"
            label="Email"
            onChangeText={text => this.setState({email: text})}
            onSubmitEditing={() => this.focusNext('3')}
            ref={input => this.inputs['2'] = input}
            returnKeyType="next"
            style={styles.formElement}
            value={this.state.email}
          />
          <TextInput
            autoCapitalize="none"
            blurOnSubmit={false}
            error={!this.state.password && this.state.isHelperTextVisible}
            label="Password"
            onChangeText={text => this.setState({password: text})}
            onSubmitEditing={() => this.focusNext('4')}
            ref={input => this.inputs['3'] = input}
            returnKeyType="next"
            secureTextEntry={true}
            style={styles.formElement}
            value={this.state.password}
          />
          <TextInput
            autoCapitalize="none"
            error={
              !this.state.confirmPassword && this.state.isHelperTextVisible
            }
            label="Confirm Password"
            onChangeText={text => this.setState({confirmPassword: text})}
            onSubmitEditing={this.signUp}
            ref={input => this.inputs['4'] = input}
            returnKeyType="done"
            secureTextEntry={true}
            style={styles.formElement}
            value={this.state.confirmPassword}
          />
          <Button
            disabled={this.state.isLoading}
            loading={this.state.isLoading}
            onPress={this.signUp}
            mode="contained"
            style={styles.signUpButton}
          >
            Create Account
          </Button>

          <Button
            color={Theme.WHITE}
            onPress={() => this.props.navigation.navigate(Routes.SIGN_IN)}
          >
            Sign In with an Existing Account
          </Button>
        </View>
      </View>
    );
  }

  signUp() {
    if (this.state.isLoading)
      return;
    
    if (!this.state.fullName || !this.state.email || !this.state.password ||
      !this.state.confirmPassword) {
      this.setState({
        helperText: Strings.MISSING_INPUT,
        isHelperTextVisible: true
      });
      return;
    }

    if (this.state.password.length < PASSWORD_MIN_LEN) {
      this.setState({
        helperText: Strings.Auth.PASSWORD_MIN_ERROR,
        isHelperTextVisible: true
      });
      return;
    }

    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        helperText: Strings.Auth.PASSWORDS_DONT_MATCH,
        isHelperTextVisible: true
      });
      return;
    }
    
    this.setState({
      helperText: null,
      isHelperTextVisible: false,
      isLoading: true
    });
    
    firebase.auth().createUserWithEmailAndPassword(
      this.state.email, this.state.password
    )
    .then(({user}) => {
      let updatesObj = {};
      updatesObj[`users/${user.uid}`] = {
        name: this.state.fullName,
        // ;)
        firstTime: true
      };
      updatesObj[`people/${user.uid}/name`] = this.state.fullName;
      firebase.database().ref().update(updatesObj);
    })
    .catch(error => {
      const errorCode = error.code;
      let helperText;
      if (errorCode === 'auth/email-already-in-use')
        helperText = Strings.Auth.EMAIL_IN_USE;
      else if (errorCode === 'auth/invalid-email')
        helperText = Strings.Auth.INVALID_EMAIL
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
    flex: 3,
    justifyContent: 'flex-start',
    marginHorizontal: 30
  },

  formElement: {
    marginBottom: 5
  },

  gutter: {
    flex: 0.3
  },

  helperText: {
    backgroundColor: Theme.ERROR,
    color: Theme.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },

  signUpButton: {
    alignSelf: 'center',
    backgroundColor: Theme.PRIMARY_DARK,
    marginTop: 15,
    marginBottom: 20
  }
});

export default SignUpView;
