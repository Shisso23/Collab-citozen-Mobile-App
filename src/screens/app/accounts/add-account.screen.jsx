import React from 'react';
import { Text, ImageBackground } from 'react-native';
import { PropTypes } from 'prop-types';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import Accounts from '../../../components/molecules/accounts/Accounts';

const AddAccountScreen = ({ route }) => {
  const { Gutters, Fonts, Layout, Images } = useTheme();
  const { params } = route;
  const selectedChannel = _.get(params, 'selectedChannel', {});

  return (
    <>
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill]}
        resizeMode="cover"
      >
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>Add an Account</Text>
        <Accounts selectedChannel={selectedChannel} />
      </ImageBackground>
    </>
  );
};

AddAccountScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

AddAccountScreen.defaultProps = {};

export default AddAccountScreen;
