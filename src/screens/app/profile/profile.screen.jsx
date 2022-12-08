import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Text, StyleSheet, View, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { UserInfoForm } from '../../../components/forms';
import { userService } from '../../../services';
import useTheme from '../../../theme/hooks/useTheme';
import FormScreenContainer from '../../../components/containers/form-screen-container/form-screen.container';
import HeaderBackGround from '../../../components/atoms/header-background';

const screenHeight = Dimensions.get('window').height;
const ProfileScreen = ({ route }) => {
  const fromBottomTab = route.params ? route.params.fromBottomTab : false;
  const { user } = useSelector((reducers) => reducers.userReducer);
  const navigation = useNavigation();
  const _onFormSuccess = () => {
    navigation.navigate('HomeScreen');
  };
  const { Gutters, Fonts } = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerVisible: true,
      header: (props) => <HeaderBackGround {...props} backButton />,
    });
  }, []);

  return (
    <>
      <View style={[styles.header]}>
        <HeaderBackGround backButton />
      </View>
      <FormScreenContainer
        contentContainerStyle={[
          Gutters.smallHMargin,
          styles.container,
          ...[{ paddingTop: fromBottomTab ? 120 : 0 }],
        ]}
      >
        <Text style={[Gutters.smallVMargin, Fonts.titleTiny]}>Profile</Text>
        <UserInfoForm
          edit
          submitForm={userService.updateUser}
          onSuccess={_onFormSuccess}
          initialValues={user}
        />
      </FormScreenContainer>
    </>
  );
};

ProfileScreen.propTypes = {
  route: PropTypes.object,
};

ProfileScreen.defaultProps = {
  route: null,
};

const styles = StyleSheet.create({
  container: { paddingBottom: screenHeight - screenHeight * 0.8 },
  header: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
    zIndex: 100,
  },
});

export default ProfileScreen;
