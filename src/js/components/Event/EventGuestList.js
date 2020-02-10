import React, {Fragment} from 'react';
import {StyleSheet, View} from 'react-native';
import {Chip, Text, Title} from 'react-native-paper';

function EventGuestList(props) {
  const guests = props.guests.map(guest => (
    <Chip
      key={guest.uid}
      style={styles.chip}
    >
      {guest.name}
    </Chip>
  ));

  return (
    <Fragment>
      <Title>
        Guests
      </Title>
      <View style={styles.chipContainer}>
        {guests.length > 0 ? guests : <Text>No guests yet.</Text>}
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  chip: {
    marginRight: 2,
    marginVertical: 2
  },

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 5
  }
});

export default EventGuestList;
