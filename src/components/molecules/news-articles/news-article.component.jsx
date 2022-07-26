import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Pressable, Platform } from 'react-native';
import { List } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import Share from 'react-native-share';

import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import useTheme from '../../../theme/hooks/useTheme';
import { userHasOpenedNewsFeedAction } from '../../../reducers/news-feed-reducer/news-feed.actions';
import { handleNotificationOpenedBackGround } from '../../../hooks/notification-background/notification-background';
import config from '../../../config';

const { width: screenWidth } = Dimensions.get('window');
const NewsArticle = (props) => {
  const { combinedLink } = config;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { item } = props;
  const { Common, Gutters, Layout, Colors } = useTheme();
  const notificationOpenedBackGround = handleNotificationOpenedBackGround();
  const { user } = useSelector((reducers) => reducers.userReducer);

  const { lastReaction } = item.userReaction;
  const [lastUserReaction, setLastUserReaction] = useState(lastReaction);
  const [likes, setLikes] = useState(item.reactions.likes);
  const [dislikes, setDislikes] = useState(item.reactions.dislikes);
  const [liked, setLiked] = useState(lastUserReaction === 'Liked');
  const [disliked, setDisLiked] = useState(lastUserReaction === 'Disliked');

  useFocusEffect(
    React.useCallback(() => {
      PushNotification.setApplicationIconBadgeNumber(0);
    }, []),
  );

  const handleLikes = () => {
    switch (lastUserReaction) {
      case 'Liked':
        setLikes(Math.max(0, likes - 1));
        setLiked(false);
        setLastUserReaction('Unliked');
        dispatch(userHasOpenedNewsFeedAction(item.newsFeedId, user.user_id, 'Unliked'));
        break;
      case 'Disliked':
        setLikes(likes + 1);
        setLiked(true);
        setDisLiked(false);
        setDislikes(Math.max(0, dislikes - 1));
        setLastUserReaction('Liked');
        dispatch(userHasOpenedNewsFeedAction(item.newsFeedId, user.user_id, 'Undisliked')).then(
          () => {
            dispatch(userHasOpenedNewsFeedAction(item.newsFeedId, user.user_id, 'Liked'));
          },
        );

        break;
      default:
        setLikes(likes + 1);
        setLiked(true);
        setLastUserReaction('Liked');
        dispatch(userHasOpenedNewsFeedAction(item.newsFeedId, user.user_id, 'Liked'));
        break;
    }
  };

  const handleDislikes = () => {
    switch (lastUserReaction) {
      case 'Disliked':
        setDislikes(Math.max(0, dislikes - 1));
        setDisLiked(false);
        setLastUserReaction('Undisliked');
        dispatch(userHasOpenedNewsFeedAction(item.newsFeedId, user.user_id, 'Undisliked'));
        break;
      case 'Liked':
        setDislikes(dislikes + 1);
        setDisLiked(true);
        setLiked(false);
        setLikes(Math.max(0, likes - 1));
        setLastUserReaction('Disliked');
        dispatch(userHasOpenedNewsFeedAction(item.newsFeedId, user.user_id, 'Unliked')).then(() => {
          dispatch(userHasOpenedNewsFeedAction(item.newsFeedId, user.user_id, 'Disliked'));
        });
        break;
      default:
        setDislikes(dislikes + 1);
        setDisLiked(true);
        setLastUserReaction('Disliked');
        dispatch(userHasOpenedNewsFeedAction(item.newsFeedId, user.user_id, 'Disliked'));
        break;
    }
  };

  useEffect(() => {
    notificationOpenedBackGround();
  });

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

  const handleShareNewstAction = () => {
    const { title, channelName, date, newsFeedImage } = item;
    const content = `To read more about the news please download the App and subscribe to the ${channelName}`;
    const messageBody = `The following news article has been shared to you through the Citizen Collab app!\n\n${title}\n\n${channelName}\n\n${date}\n\n${content}\n\n${combinedLink}`;
    const shareContentAnroid = {
      title: 'Collab citizen News Article',
      message: messageBody,
      url: `${newsFeedImage}`,
      subject: 'Collab citizen News Article',
      failOnCancel: false,
      showAppsToView: true,
    };

    const shareContentIos = {
      url: `${newsFeedImage}`,
      message: `Collab citizen News Article\n\n${messageBody}`,
      subject: 'Collab citizen News Article',
      // failOnCancel: false,
      showAppsToView: true,
    };

    Share.open(Platform.OS === 'android' ? shareContentAnroid : shareContentIos)
      .then((resp) => {
        console.log({ resp });
        if (Platform.OS === 'ios') {
          Share.open({ url: `${newsFeedImage}` });
        }
      })
      .catch(() => null);
  };

  const renderUserReactions = () => {
    return (
      <View style={[styles.newsButtons, Gutters.tinyTMargin, Layout.row]}>
        <Icon
          name={liked ? 'thumb-up' : 'thumb-up-outline'}
          type="material-community"
          size={30}
          color="#3A609C"
          onPress={handleLikes}
          containerStyle={[Layout.justifyContentCenter, Gutters.smallTMarin]}
          style={[Gutters.tinyRMargin, styles.clockIcon]}
        />

        <Text style={[Gutters.tinyTMargin, Gutters.tinyHMargin]}>{likes}</Text>

        <Icon
          name={disliked ? 'thumb-down' : 'thumb-down-outline'}
          type="material-community"
          size={30}
          color="#3A609C"
          onPress={handleDislikes}
          containerStyle={[Layout.justifyContentCenter, Gutters.smallTMarin]}
          style={[Gutters.tinyRMargin, styles.clockIcon, styles.dislikeButton]}
        />

        <Text style={[Gutters.tinyTMargin, Gutters.tinyHMargin]}>{dislikes}</Text>

        <View style={[styles.shareButtonView, Layout.end]}>
          <Icon
            name="share-outline"
            type="material-community"
            size={30}
            color="#3A609C"
            onPress={handleShareNewstAction}
            containerStyle={[Layout.justifyContentCenter, Gutters.smallTMarin]}
            style={[Gutters.tinyRMargin, styles.clockIcon]}
          />
        </View>
      </View>
    );
  };

  const onArticleClick = () => {
    navigation.navigate('ViewNewsFeedArticleDetails', { newsFeedItem: item });
  };

  const renderNewsFeedDescription = () => {
    return (
      <>
        <Text style={Common.cardTitle}>{item.title}</Text>
        <Text style={[Gutters.tinyTMargin, { color: Colors.primary }]}>{item.channelName}</Text>
        <View style={[Layout.rowBetween, Layout.alignItemsCenter]}>
          <View style={[Layout.row, Gutters.tinyTMargin]}>
            <Icon
              name="clock-o"
              type="font-awesome"
              size={15}
              containerStyle={[Layout.justifyContentCenter, Gutters.smallTMarin]}
              style={[Gutters.tinyRMargin, styles.clockIcon]}
            />
            <Text style={{ color: Colors.black }}>{formatDate(item.date)}</Text>
          </View>
          <View
            style={[Common.statusIndicator, { backgroundColor: _getStatusIndicator(item.seen) }]}
          />
        </View>
        {renderUserReactions()}
      </>
    );
  };

  return (
    <View style={[Common.textInputWithShadow, Gutters.tinyMargin]}>
      {item.newsFeedImage != null ? (
        <Pressable onPress={onArticleClick}>
          {() => (
            <FastImage
              style={styles.imageStyle}
              source={{
                uri: item.newsFeedImage,
              }}
            />
          )}
        </Pressable>
      ) : null}
      <List.Item
        titleStyle={Common.cardTitle}
        description={renderNewsFeedDescription}
        onPress={onArticleClick}
        titleNumberOfLines={3}
      />
      {/* <ActionSheet ref={actionSheetRef} gestureEnabled>
        <View style={safeArea}>
          <NewsFeedShareActionSheetContent handleShareNewstAction={handleShareNewstAction} />
        </View>
      </ActionSheet> */}
    </View>
  );
};

export default NewsArticle;

const styles = StyleSheet.create({
  clockIcon: { opacity: 0.75 },
  dislikeButton: {
    paddingLeft: 12,
  },
  imageStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: screenWidth * 0.5,
    resizeMode: 'cover',
    width: '100%',
  },
  newsButtons: {
    display: 'flex',
  },
  shareButtonView: {
    marginLeft: 'auto',
  },
});

NewsArticle.propTypes = {
  item: PropTypes.object.isRequired,
};
