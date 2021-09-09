import React from 'react';
import { View, StyleSheet, Image, Modal, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { Button, Text } from 'react-native-elements';
import { useDispatch } from 'react-redux';

import useTheme from '../../../theme/hooks/useTheme';
import { initAppAction } from '../../../reducers/app-reducer/app.actions';
import Common from '../../../theme/Common';
import { Colors } from '../../../theme/Variables';
import { setIsServerOfflineAction } from '../../../reducers/user-auth-reducer/user-auth.reducer';

const TimeoutScreen = ({ route }) => {
  const { Fonts, Images, Gutters, Layout } = useTheme();
  const { timeoutMessage } = route.params;
  const dispatch = useDispatch();

  const retry = () => {
    dispatch(initAppAction());
  };

  return (
    <Modal animationType="none">
      <View style={[Layout.alignItemsCenter, Layout.justifyContentStart, Layout.fill]}>
        <Image
          source={Images.serverDown}
          resizeMode="contain"
          style={styles.image}
          containerStyle={[Gutters.largeHMargin, Layout.alignSelfCenter]}
          placeholderStyle={styles.placeholder}
        />
        <Text style={[Fonts.textLarge, Common.blackText, styles.texts]}>{timeoutMessage}</Text>
        <Button
          title="Try again"
          onPress={retry}
          titleStyle={styles.buttonTitle}
          containerStyle={[Layout.alignItemsCenter, Layout.alignSelfCenter, styles.submitButton]}
        />
        <Pressable
          onPress={() => {
            dispatch(setIsServerOfflineAction(false));
          }}
        >
          {() => {
            return (
              <Text
                style={[
                  styles.signOut,
                  Layout.alignItemsCenter,
                  Layout.alignSelfCenter,
                  styles.submitButton,
                ]}
              >
                Sign out
              </Text>
            );
          }}
        </Pressable>
      </View>
    </Modal>
  );
};

TimeoutScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

TimeoutScreen.defaultProps = {};

export default TimeoutScreen;

const styles = StyleSheet.create({
  buttonTitle: {
    fontSize: 25,
  },
  image: {
    height: 230,
    marginBottom: 15,
    marginTop: '44%',
    width: 310,
  },
  signOut: { color: Colors.primary, fontSize: 19, textDecorationLine: 'underline' },
  submitButton: {
    marginTop: 25,
  },
  texts: { fontSize: 25 },
});
