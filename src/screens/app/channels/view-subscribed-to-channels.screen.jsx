import React from 'react';
import { FAB, List } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  FlatList,
  Text,
  View,
  ImageBackground,
  RefreshControl,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import useTheme from '../../../theme/hooks/useTheme';
import { permissionsService } from '../../../services';
import { myChannelsSelector } from '../../../reducers/my-channels/my-channels.reducer';
import { getMyChannelsAction } from '../../../reducers/my-channels/my-channels.actions';

const ViewSubscribeToChannelsScreen = () => {
  const screenHeight = Dimensions.get('window').height;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { Common, Gutters, Fonts, Layout, Images, Colors } = useTheme();
  const { myChannels, isLoadingMyChannels } = useSelector(myChannelsSelector);

  const _loadMyChannels = () => {
    dispatch(getMyChannelsAction());
  };

  useFocusEffect(
    React.useCallback(() => {
      _loadMyChannels();
    }, []),
  );

  const _handleOnSubscribeToChannelsPress = async () => {
    await permissionsService.checkLocationPermissions();
    navigation.navigate('SelectLocationScreen', { fromSubscribedChannels: true });
  };

  const _getStatusIndicator = (status) => {
    switch (status) {
      case 'Subscribed':
        return Colors.primary;
      case 'pending':
        return Colors.error;
      default:
        return Colors.primary;
    }
  };

  const viewSubscribedToChannelsItem = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin, styles.channelItem]}>
        <List.Item
          title={item.name}
          titleStyle={Common.cardTitle}
          onPress={() => {
            navigation.navigate('ViewSubscribedToChannelDetails', { channelItem: item });
          }}
          description={() => (
            <View style={[Layout.column, Gutters.largeRMargin]}>
              <View style={[Layout.rowHCenter, Gutters.tinyTPadding]}>
                <View
                  style={[
                    Gutters.tinyHMargin,
                    Common.statusIndicator,
                    { backgroundColor: _getStatusIndicator(item.status) },
                  ]}
                />
                <Text style={[Fonts.textRegular, Common.cardDescription]}>Subscribed</Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <>
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill]}
        resizeMode="cover"
      >
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>My Channels</Text>
        <FlatList
          contentContainerStyle={Gutters.smallHMargin}
          data={myChannels}
          renderItem={viewSubscribedToChannelsItem}
          keyExtractor={(item) => String(item.objId)}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingMyChannels}
              onRefresh={_loadMyChannels}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        />
      </ImageBackground>

      <FAB
        style={[Common.fabAlignment, { marginBottom: screenHeight - screenHeight * 0.85 }]}
        icon="plus"
        onPress={_handleOnSubscribeToChannelsPress}
      />
    </>
  );
};

const styles = StyleSheet.create({
  channelItem: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

ViewSubscribeToChannelsScreen.propTypes = {};

ViewSubscribeToChannelsScreen.defaultProps = {};

export default ViewSubscribeToChannelsScreen;
