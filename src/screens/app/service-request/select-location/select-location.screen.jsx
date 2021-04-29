import React, { useEffect } from 'react';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import useTheme from '../../../../theme/hooks/useTheme';
import { locationSelector } from '../../../../reducers/location-reducer/location.reducer';
import {
  getAddressFromRegionAction,
  getCurrentPositionAction,
} from '../../../../reducers/location-reducer/location.actions';

const SelectLocationScreen = () => {
  const { Colors, Layout } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { region, selectedAddress } = useSelector(locationSelector);

  useEffect(() => {
    dispatch(getCurrentPositionAction());
  }, []);

  return region ? (
    <View style={[Layout.fill]}>
      <MapView
        style={[Layout.fill]}
        initialRegion={region}
        showsUserLocation
        onRegionChangeComplete={(newRegion) => dispatch(getAddressFromRegionAction(newRegion))}
      />
      <View style={styles.pinContainer}>
        <Icon name="pin-outline" size={30} color={Colors.primary} />
      </View>

      <View style={[Layout.fullWidth, styles.buttonContainer]}>
        <TextInput label="Address" value={selectedAddress} editable={false} />

        <Button mode="contained" onPress={() => navigation.pop()}>
          Pick this location
        </Button>
      </View>
    </View>
  ) : (
    <View style={[Layout.center, Layout.fill]}>
      <ActivityIndicator size="large" animating color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    bottom: 20,
    position: 'absolute',
  },
  pinContainer: {
    left: '47%',
    position: 'absolute',
    top: '45%',
  },
});

SelectLocationScreen.propTypes = {};

SelectLocationScreen.defaultProps = {};

export default SelectLocationScreen;
