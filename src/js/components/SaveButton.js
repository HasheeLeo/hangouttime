import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';

import PropTypes from 'prop-types';

SaveButton.propTypes = {
  isSaving: PropTypes.bool,
  onPressSave: PropTypes.func.isRequired
};

function SaveButton(props) {
  return (
    <Button
      disabled={props.isSaving}
      loading={props.isSaving}
      mode="contained"
      onPress={props.onPressSave}
      style={styles.button}
    >
      Save
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 5,
    paddingHorizontal: 20
  }
});

export default SaveButton;
