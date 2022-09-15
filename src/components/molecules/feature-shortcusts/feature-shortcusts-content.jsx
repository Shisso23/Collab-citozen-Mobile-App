import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import _ from 'lodash';

import { myChannelsSelector } from '../../../reducers/my-channels/my-channels.reducer';
import { getMyChannelsAction } from '../../../reducers/my-channels/my-channels.actions';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const ShortCutsActionSheetContent = ({
  onPressSubscribeToChannel,
  onPressNewServiceRequest,
  onPressAddAccount,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const [accountButtonStyle, setAccountButtonStyle] = useState({});
  const [serviceRequestButtonStyle, setServiceRequesButtonStyle] = useState({});
  const [channelsButtonStyle, setChannelsButtonStyle] = useState({});
  const [accountApplicableChannels, setAccountApplicableChannels] = useState([]);
  const { myChannels } = useSelector(myChannelsSelector);
  const { Gutters, Layout, Common } = useTheme();

  const _loadMyChannels = () => {
    dispatch(getMyChannelsAction()).then(() => {
      setAccountApplicableChannels(
        myChannels.filter((channel) => _.get(channel, 'accountApplicable', null) === true),
      );
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      _loadMyChannels();
    }, []),
  );

  const renderCloseButton = () => {
    return (
      <>
        <TouchableOpacity onPress={onCancel} style={Layout.alignSelfEnd}>
          <Icon name="x-circle" type="feather" color={Colors.lightgray} />
        </TouchableOpacity>
      </>
    );
  };
  return (
    <View style={[Gutters.smallPadding, { backgroundColor: Colors.softBlue }]}>
      {renderCloseButton()}
      <TouchableOpacity
        onPress={onPressSubscribeToChannel}
        onPressIn={() => setChannelsButtonStyle({ backgroundColor: Colors.primary })}
        onPressOut={() => setChannelsButtonStyle({ backgroundColor: Colors.transparent })}
        style={[
          Common.viewWithShadow,
          styles.confirmButton,
          Layout.alignSelfCenter,
          Layout.alignItemsCenter,
          Gutters.largeHPadding,
          Gutters.regularVPadding,
          Gutters.smallBMargin,
          channelsButtonStyle,
        ]}
      >
        <Text style={[...[{ color: Colors.white, fontSize: 18 }]]}>Subscribe To Channel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onPressNewServiceRequest}
        onPressIn={() => setServiceRequesButtonStyle({ backgroundColor: Colors.primary })}
        onPressOut={() => setServiceRequesButtonStyle({ backgroundColor: Colors.transparent })}
        style={[
          Common.viewWithShadow,
          styles.confirmButton,
          Layout.alignSelfCenter,
          Layout.alignItemsCenter,
          Gutters.largeHPadding,
          Gutters.regularVPadding,
          Gutters.smallBMargin,
          serviceRequestButtonStyle,
        ]}
      >
        <Text style={[...[{ color: Colors.white, fontSize: 18 }]]}>New Service Request</Text>
      </TouchableOpacity>

      {accountApplicableChannels.length > 0 && (
        <TouchableOpacity
          onPress={onPressAddAccount}
          onPressIn={() => setAccountButtonStyle({ backgroundColor: Colors.primary })}
          onPressOut={() => setAccountButtonStyle({ backgroundColor: Colors.transparent })}
          style={[
            Common.viewWithShadow,
            styles.confirmButton,
            Layout.alignSelfCenter,
            Layout.alignItemsCenter,
            Gutters.largeHPadding,
            Gutters.regularVPadding,
            accountButtonStyle,
          ]}
        >
          <Text style={[...[{ color: Colors.white, fontSize: 18 }]]}>Add Account</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  confirmButton: {
    backgroundColor: Colors.transparent,
    borderColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    width: '80%',
  },
});

ShortCutsActionSheetContent.propTypes = {
  onPressSubscribeToChannel: PropTypes.func.isRequired,
  onPressNewServiceRequest: PropTypes.func.isRequired,
  onPressAddAccount: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
ShortCutsActionSheetContent.defaultProps = {};

export default ShortCutsActionSheetContent;
