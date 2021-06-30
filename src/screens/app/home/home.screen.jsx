import React, { useEffect } from 'react';
import {
  View,
  ImageBackground,
  RefreshControl,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { FAB, List } from 'react-native-paper';
import { Text, Image } from 'react-native-elements';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import PushNotification from 'react-native-push-notification';

import useTheme from '../../../theme/hooks/useTheme';
import { permissionsService } from '../../../services';
import { getNewsFeedAction } from '../../../reducers/news-feed-reducer/news-feed.actions';
import { newsFeedSelector } from '../../../reducers/news-feed-reducer/news-feed.reducer';
import { exitAppOnHardwarePressListener } from '../../../helpers';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { Common, Gutters, Fonts, Layout, Colors, Images } = useTheme();
  const { newsFeeds, isLoadingNewsFeeds } = useSelector(newsFeedSelector);

  useFocusEffect(exitAppOnHardwarePressListener);

  useFocusEffect(
    React.useCallback(() => {
      PushNotification.setApplicationIconBadgeNumber(0);
    }, []),
  );

  useEffect(() => {
    _loadNewsFeeds();
  }, []);

  const _loadNewsFeeds = () => {
    dispatch(getNewsFeedAction());
  };

  const _getStatusIndicator = (status) => {
    switch (status) {
      case 'Yes':
        return Colors.primary;
      case 'No':
        return Colors.red;
      default:
        return Colors.error;
    }
  };

  const _handleOnServiceRequestCreatePress = async () => {
    await permissionsService.checkLocationPermissions();
    navigation.navigate('SelectLocationScreen');
  };

  const newsFeedItem = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin]}>
        <Image
          source={item.newsFeedImage}
          style={styles.imageStyle}
          onPress={() => {
            navigation.navigate('ViewNewsFeedArticle', { newsFeedItem: item });
          }}
        />
        <List.Item
          title={item.title}
          description={() => (
            <View style={Layout.alignItemsEnd}>
              <View
                style={[
                  Common.statusIndicator,
                  { backgroundColor: _getStatusIndicator(item.seen) },
                ]}
              />
            </View>
          )}
          onPress={() => {
            navigation.navigate('ViewNewsFeedArticle', { newsFeedItem: item });
          }}
          titleNumberOfLines={3}
        />
      </View>
    );
  };

  return (
    <>
      <ImageBackground source={Images.serviceRequest} style={[Layout.fullSize]} resizeMode="cover">
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>Home</Text>
        <FlatList
          contentContainerStyle={Gutters.smallHMargin}
          data={newsFeeds}
          renderItem={newsFeedItem}
          keyExtractor={(item) => String(item.newsFeedId)}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingNewsFeeds}
              onRefresh={_loadNewsFeeds}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        />
      </ImageBackground>

      <FAB style={Common.fabAlignment} icon="plus" onPress={_handleOnServiceRequestCreatePress} />
    </>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    aspectRatio: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flex: 1,
    height: 200,
    maxWidth: screenWidth,
  },
});

HomeScreen.propTypes = {};

HomeScreen.defaultProps = {};

export default HomeScreen;
