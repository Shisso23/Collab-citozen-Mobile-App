import React, { useEffect } from 'react';
import {
  View,
  ImageBackground,
  RefreshControl,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { List } from 'react-native-paper';
import { Text, Image, Icon } from 'react-native-elements';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';

import useTheme from '../../../theme/hooks/useTheme';
import { getNewsFeedAction } from '../../../reducers/news-feed-reducer/news-feed.actions';
import { newsFeedSelector } from '../../../reducers/news-feed-reducer/news-feed.reducer';
import { exitAppOnHardwarePressListener } from '../../../helpers';
import { handleNotificationOpenedBackGround } from '../../../hooks/notification-background/notification-background';

const { width: screenWidth } = Dimensions.get('window');
const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { Common, Gutters, Fonts, Layout, Colors, Images } = useTheme();
  const { newsFeeds, isLoadingNewsFeeds } = useSelector(newsFeedSelector);
  const notificationOpenedBackGround = handleNotificationOpenedBackGround();

  useFocusEffect(exitAppOnHardwarePressListener);

  useFocusEffect(
    React.useCallback(() => {
      PushNotification.setApplicationIconBadgeNumber(0);
      _loadNewsFeeds();
    }, []),
  );

  useEffect(() => {
    notificationOpenedBackGround();
  });

  const _loadNewsFeeds = () => {
    dispatch(getNewsFeedAction());
  };
  const formatDate = (date) => {
    return moment(date).fromNow();
  };

  const _getStatusIndicator = (status) => {
    switch (status) {
      case 'Yes':
        return Colors.transparent;
      case 'No':
        return Colors.primary;
      default:
        return Colors.error;
    }
  };

  const newsFeedItem = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin]}>
        {item.newsFeedImage != null ? (
          <View style={styles.imageContainer}>
            <Image
              source={item.newsFeedImage}
              style={styles.imageStyle}
              onPress={() => {
                navigation.navigate('ViewNewsFeedArticle', { newsFeedItem: item });
              }}
            />
          </View>
        ) : null}

        <List.Item
          title={item.title}
          titleStyle={Common.cardTitle}
          description={() => (
            <View style={[Layout.rowBetween, Layout.alignItemsCenter]}>
              <View style={[Layout.row, Gutters.tinyTMargin]}>
                <Icon
                  name="clock-o"
                  type="font-awesome"
                  size={15}
                  style={[Gutters.smallRMargin, styles.clockIcon]}
                />
                <Text style={{ color: Colors.black }}>{formatDate(item.date)}</Text>
              </View>
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
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill]}
        resizeMode="cover"
      >
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>News</Text>
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
    </>
  );
};

const styles = StyleSheet.create({
  clockIcon: { opacity: 0.75 },
  imageContainer: {
    height: screenWidth * 0.6,
    width: '100%',
  },
  imageStyle: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: '100%',
    resizeMode: 'contain',
    width: '100%',
  },
});

HomeScreen.propTypes = {};

HomeScreen.defaultProps = {};

export default HomeScreen;
