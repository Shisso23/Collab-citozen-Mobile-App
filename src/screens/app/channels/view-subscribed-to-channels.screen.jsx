import React from 'react';
import { FAB, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { FlatList, Text, View, ImageBackground } from 'react-native';

import useTheme from '../../../theme/hooks/useTheme';
import { permissionsService } from '../../../services';

const ViewSubscribeToChannelsScreen = () => {
  const navigation = useNavigation();
  const { Common, Gutters, Fonts, Layout, Images } = useTheme();

  const _handleOnSubscribeToChannelsPress = async () => {
    await permissionsService.checkLocationPermissions();
    navigation.navigate('SelectLocationScreen', true);
  };

  const newsFeedDummyObject = {
    dummyId: 1,
    title: 'Buffalo City (East London)',
    status: true,
  };

  const newsFeedDummyObject2 = {
    dummyId: 2,
    title: 'City of Cape Town',
    subscribed: true,
  };

  const dummyarray = [];
  dummyarray.push(newsFeedDummyObject);
  dummyarray.push(newsFeedDummyObject2);

  const viewSubscribedToChannelsItem = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin]}>
        <List.Item title={item.title} />
      </View>
    );
  };

  return (
    <>
      <ImageBackground source={Images.serviceRequest} style={[Layout.fullSize]} resizeMode="cover">
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>My Channels</Text>
        <FlatList
          contentContainerStyle={[Gutters.smallHMargin]}
          data={dummyarray}
          renderItem={viewSubscribedToChannelsItem}
          keyExtractor={(item) => String(item.dummyId)}
        />
      </ImageBackground>

      <FAB style={[Common.fabAlignment]} icon="plus" onPress={_handleOnSubscribeToChannelsPress} />
    </>
  );
};

ViewSubscribeToChannelsScreen.propTypes = {};

ViewSubscribeToChannelsScreen.defaultProps = {};

export default ViewSubscribeToChannelsScreen;
