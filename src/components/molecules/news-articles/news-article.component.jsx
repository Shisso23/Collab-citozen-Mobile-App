import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Pressable } from 'react-native';
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

const { width: screenWidth } = Dimensions.get('window');
const NewsArticle = (props) => {
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

  useEffect(() => {
    console.log({ lastUserReaction });
  }, [lastUserReaction]);
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
  const shareNewsArticle = async (newsFeedTitle, newsFeedChannel, newsFeedDate, newsFeedBody) => {
    const messageBody = `The following news article has been shared to you through the Citizen Collab app!\n\n${newsFeedTitle}\n\n${newsFeedChannel}\n\n${newsFeedDate}\n\n${newsFeedBody}`;

    const shareContent = {
      message: messageBody,
      url: null,
    };

    Share.open(shareContent).then(() => {
      dispatch(userHasOpenedNewsFeedAction(item.newsFeedId, user.user_id, 'Shared'));
    });
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
            onPress={() => shareNewsArticle(item.title, item.channelName, item.date, item.body)}
            containerStyle={[Layout.justifyContentCenter, Gutters.smallTMarin]}
            style={[Gutters.tinyRMargin, styles.clockIcon]}
          />
        </View>
      </View>
    );
  };

  const onArticleClick = () => {
    navigation.navigate('ViewNewsFeedArticle', { newsFeedItem: item });
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
        onPress={() => navigation.navigate('ViewNewsFeedArticle', { newsFeedItem: item })}
        titleNumberOfLines={3}
      />
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