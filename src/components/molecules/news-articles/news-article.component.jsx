import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Image, Pressable } from 'react-native';
import { List } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import Share from 'react-native-share';

import PropTypes from 'prop-types';
import useTheme from '../../../theme/hooks/useTheme';
import { userHasOpenedNewsFeedAction } from '../../../reducers/news-feed-reducer/news-feed.actions';
import { handleNotificationOpenedBackGround } from '../../../hooks/notification-background/notification-background';

const { width: screenWidth } = Dimensions.get('window');
const NewsArticle = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { item, index, isLoadingNewsFeeds } = props;
  const { Common, Gutters, Layout, Colors } = useTheme();
  const notificationOpenedBackGround = handleNotificationOpenedBackGround();
  const { user } = useSelector((reducers) => reducers.userReducer);
  const [increaseLikeVisually, setIncreaseLikeVisually] = useState(false);
  const [increaseDislikeVisually, setIncreaseDislikeVisually] = useState(false);
  const [visualLikeCounter, setVisualLikeCounter] = useState(0);
  const [visualDislikeCounter, setVisualDislikeCounter] = useState(0);
  const [currentNewsfeedIndex, setCurrentNewsfeedIndex] = useState(0);
  const [useLoadNewsFeeds, setUseLoadNewsFeeds] = useState(true);
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const [alreadyDisliked, setAlreadyDisliked] = useState(false);
  const [preventPress, setPreventPress] = useState(true);
  let alreadyLikedUseLoadNewsFeedsVar = false;
  let alreadyDislikedUseLoadNewsFeedsVar = false;
  let temporarilyPreventClickingReaction = false;

  useFocusEffect(
    React.useCallback(() => {
      setIncreaseLikeVisually(false);
      setIncreaseDislikeVisually(false);
      setCurrentNewsfeedIndex(index);
      setUseLoadNewsFeeds(true);
      setVisualLikeCounter(0);
      setVisualDislikeCounter(0);
      setAlreadyLiked(false);
      setAlreadyDisliked(false);
      setPreventPress(true);
      PushNotification.setApplicationIconBadgeNumber(0);
      alreadyLikedUseLoadNewsFeedsVar = false;
      alreadyDislikedUseLoadNewsFeedsVar = false;
      temporarilyPreventClickingReaction = false;
    }, []),
  );

  useEffect(() => {
    if (!isLoadingNewsFeeds) {
      setPreventPress(false);
    }
  }, [isLoadingNewsFeeds]);

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

  const likePressStartFunction = async () => {
    if (useLoadNewsFeeds && item.userReaction.lastReaction === 'Liked') {
      setAlreadyLiked(true);
      if (useLoadNewsFeeds) {
        alreadyLikedUseLoadNewsFeedsVar = true;
      }
    }
    if (useLoadNewsFeeds && item.userReaction.lastReaction === 'Disliked') {
      setAlreadyDisliked(true);
      if (useLoadNewsFeeds) {
        alreadyDislikedUseLoadNewsFeedsVar = true;
      }
    }
    setCurrentNewsfeedIndex(index);
    setUseLoadNewsFeeds(false);
  };

  const likePressNoReactionFunction = async () => {
    setIncreaseLikeVisually(true);
    if (alreadyLiked || (alreadyLikedUseLoadNewsFeedsVar && useLoadNewsFeeds)) {
      setVisualLikeCounter(0);
    } else {
      setVisualLikeCounter(1);
    }
    dispatch(userHasOpenedNewsFeedAction(item.newsFeedId, user.user_id, 'Liked'));
  };

  const likePressAlreadyDislikedFunction = async () => {
    setIncreaseLikeVisually(true);
    setIncreaseDislikeVisually(false);
    if (alreadyDisliked || (alreadyDislikedUseLoadNewsFeedsVar && useLoadNewsFeeds)) {
      setVisualLikeCounter(1);
      setVisualDislikeCounter(-1);
    } else if (alreadyLiked) {
      setVisualLikeCounter(0);
      setVisualDislikeCounter(0);
    } else {
      setVisualLikeCounter(1);
      setVisualDislikeCounter(0);
    }
    dispatch(userHasOpenedNewsFeedAction(item.newsFeedId, user.user_id, 'Undisliked')).then(() =>
      dispatch(userHasOpenedNewsFeedAction(item.newsFeedId, user.user_id, 'Liked')).then(),
    );
  };

  const likePressElseFunction = async () => {
    setIncreaseLikeVisually(false);
    if (alreadyLiked || (alreadyLikedUseLoadNewsFeedsVar && useLoadNewsFeeds)) {
      setVisualLikeCounter(-1);
    } else {
      setVisualLikeCounter(0);
    }
    dispatch(userHasOpenedNewsFeedAction(item.newsFeedId, user.user_id, 'Unliked'));
  };

  const likePressEndFunction = async () => {
    setUseLoadNewsFeeds(false);
    temporarilyPreventClickingReaction = false;
  };

  const likePress = async () => {
    if (preventPress) {
      return;
    }
    likePressStartFunction();
    if (
      (useLoadNewsFeeds &&
        item.userReaction.lastReaction !== 'Liked' &&
        item.userReaction.lastReaction !== 'Disliked') ||
      (!useLoadNewsFeeds && !increaseLikeVisually && !increaseDislikeVisually)
    ) {
      likePressNoReactionFunction();
    } else if (
      (useLoadNewsFeeds && item.userReaction.lastReaction === 'Disliked') ||
      (!useLoadNewsFeeds && increaseDislikeVisually)
    ) {
      likePressAlreadyDislikedFunction();
    } else if (
      (useLoadNewsFeeds && item.userReaction.lastReaction === 'Liked') ||
      (!useLoadNewsFeeds && increaseLikeVisually)
    ) {
      likePressElseFunction();
    }
    likePressEndFunction();
  };

  const dislikePressStartFunction = async () => {
    if (useLoadNewsFeeds && item.userReaction.lastReaction === 'Disliked') {
      setAlreadyDisliked(true);
      if (useLoadNewsFeeds) {
        alreadyDislikedUseLoadNewsFeedsVar = true;
      }
    }
    if (useLoadNewsFeeds && item.userReaction.lastReaction === 'Liked') {
      setAlreadyLiked(true);
      if (useLoadNewsFeeds) {
        alreadyLikedUseLoadNewsFeedsVar = true;
      }
    }
    setCurrentNewsfeedIndex(index);
    setUseLoadNewsFeeds(false);
  };

  const dislikePressNoReactionFunction = async () => {
    setIncreaseDislikeVisually(true);
    if (alreadyDisliked || (alreadyDislikedUseLoadNewsFeedsVar && useLoadNewsFeeds)) {
      setVisualDislikeCounter(0);
    } else {
      setVisualDislikeCounter(1);
    }
    dispatch(userHasOpenedNewsFeedAction(item.newsFeedId, user.user_id, 'Disliked'));
  };

  const dislikePressAlreadyLikedFunction = async () => {
    setIncreaseDislikeVisually(true);
    setIncreaseLikeVisually(false);
    if (alreadyLiked || (alreadyLikedUseLoadNewsFeedsVar && useLoadNewsFeeds)) {
      setVisualDislikeCounter(1);
      setVisualLikeCounter(-1);
    } else if (alreadyDisliked) {
      setVisualDislikeCounter(0);
      setVisualLikeCounter(0);
    } else {
      setVisualDislikeCounter(1);
      setVisualLikeCounter(0);
    }
    dispatch(userHasOpenedNewsFeedAction(item.newsFeedId, user.user_id, 'Unliked')).then(() =>
      dispatch(userHasOpenedNewsFeedAction(item.newsFeedId, user.user_id, 'Disliked')),
    );
  };

  const dislikePressElseCaseFunction = async () => {
    setIncreaseDislikeVisually(false);
    if (alreadyDisliked || (alreadyDislikedUseLoadNewsFeedsVar && useLoadNewsFeeds)) {
      setVisualDislikeCounter(-1);
    } else {
      setVisualDislikeCounter(0);
    }
    dispatch(userHasOpenedNewsFeedAction(item.newsFeedId, user.user_id, 'Undisliked'));
  };

  const dislikePressEndFunction = async () => {
    setUseLoadNewsFeeds(false);
    temporarilyPreventClickingReaction = false;
  };

  const dislikePress = () => {
    if (preventPress) {
      return;
    }
    dislikePressStartFunction();
    if (
      (useLoadNewsFeeds &&
        item.userReaction.lastReaction !== 'Disliked' &&
        item.userReaction.lastReaction !== 'Liked') ||
      (!useLoadNewsFeeds && !increaseDislikeVisually && !increaseLikeVisually)
    ) {
      dislikePressNoReactionFunction();
    } else if (
      (useLoadNewsFeeds && item.userReaction.lastReaction === 'Liked') ||
      (!useLoadNewsFeeds && increaseLikeVisually)
    ) {
      dislikePressAlreadyLikedFunction();
    } else if (
      (useLoadNewsFeeds && item.userReaction.lastReaction === 'Disliked') ||
      (!useLoadNewsFeeds && increaseDislikeVisually)
    ) {
      dislikePressElseCaseFunction();
    }
    dislikePressEndFunction();
  };

  return (
    <View style={[Common.textInputWithShadow, Gutters.tinyMargin]}>
      {item.newsFeedImage != null ? (
        <Pressable
          onPress={() => {
            navigation.navigate('ViewNewsFeedArticle', { newsFeedItem: item });
          }}
        >
          {() => (
            <Image
              resizeMode="cover"
              source={{ uri: item.newsFeedImage }}
              style={styles.imageStyle}
            />
          )}
        </Pressable>
      ) : null}
      <List.Item
        titleStyle={Common.cardTitle}
        description={() => (
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
                style={[
                  Common.statusIndicator,
                  { backgroundColor: _getStatusIndicator(item.seen) },
                ]}
              />
            </View>
            <View style={[styles.newsButtons, Gutters.tinyTMargin, Layout.row]}>
              {(useLoadNewsFeeds &&
                item.userReaction.lastReaction === 'Liked' &&
                currentNewsfeedIndex === index) ||
              (!useLoadNewsFeeds && increaseLikeVisually && currentNewsfeedIndex === index) ? (
                <Icon
                  name="thumb-up"
                  type="material-community"
                  size={30}
                  color="#3A609C"
                  onPress={() => {
                    if (!temporarilyPreventClickingReaction) {
                      temporarilyPreventClickingReaction = true;
                      setTimeout(() => likePress(item, index), 250);
                    }
                  }}
                  containerStyle={[Layout.justifyContentCenter, Gutters.smallTMarin]}
                  style={[Gutters.tinyRMargin, styles.clockIcon]}
                />
              ) : (
                <Icon
                  name="thumb-up-outline"
                  type="material-community"
                  size={30}
                  color="#3A609C"
                  onPress={() => {
                    if (!temporarilyPreventClickingReaction) {
                      temporarilyPreventClickingReaction = true;
                      setTimeout(() => likePress(item, index), 250);
                    }
                  }}
                  containerStyle={[Layout.justifyContentCenter, Gutters.smallTMarin]}
                  style={[Gutters.tinyRMargin, styles.clockIcon]}
                />
              )}
              {currentNewsfeedIndex === index ? (
                <Text style={[Gutters.tinyTMargin, Gutters.tinyHMargin]}>
                  {item.reactions.likes + visualLikeCounter}
                </Text>
              ) : (
                <Text style={Gutters.tinyTMargin}> {item.reactions.likes} </Text>
              )}
              {(useLoadNewsFeeds &&
                item.userReaction.lastReaction === 'Disliked' &&
                currentNewsfeedIndex === index) ||
              (!useLoadNewsFeeds && increaseDislikeVisually && currentNewsfeedIndex === index) ? (
                <Icon
                  name="thumb-down"
                  type="material-community"
                  size={30}
                  color="#3A609C"
                  onPress={() => {
                    if (!temporarilyPreventClickingReaction) {
                      temporarilyPreventClickingReaction = true;
                      setTimeout(() => dislikePress(item, index), 250);
                    }
                  }}
                  containerStyle={[Layout.justifyContentCenter, Gutters.smallTMarin]}
                  style={[Gutters.tinyRMargin, styles.clockIcon, styles.dislikeButton]}
                />
              ) : (
                <Icon
                  name="thumb-down-outline"
                  type="material-community"
                  size={30}
                  color="#3A609C"
                  onPress={() => {
                    if (!temporarilyPreventClickingReaction) {
                      temporarilyPreventClickingReaction = true;
                      setTimeout(() => dislikePress(item, index), 250);
                    }
                  }}
                  containerStyle={[Layout.justifyContentCenter, Gutters.smallTMarin]}
                  style={[Gutters.tinyRMargin, styles.clockIcon, styles.dislikeButton]}
                />
              )}
              {currentNewsfeedIndex === index ? (
                <Text style={[Gutters.tinyTMargin, Gutters.tinyHMargin]}>
                  {item.reactions.dislikes + visualDislikeCounter}
                </Text>
              ) : (
                <Text style={Gutters.tinyTMargin}> {item.reactions.dislikes}</Text>
              )}
              <View style={[styles.shareButtonView, Layout.end]}>
                <Icon
                  name="share-outline"
                  type="material-community"
                  size={30}
                  color="#3A609C"
                  onPress={() =>
                    shareNewsArticle(item.title, item.channelName, item.date, item.body)
                  }
                  containerStyle={[Layout.justifyContentCenter, Gutters.smallTMarin]}
                  style={[Gutters.tinyRMargin, styles.clockIcon]}
                />
              </View>
            </View>
          </>
        )}
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
  index: PropTypes.number.isRequired,
  isLoadingNewsFeeds: PropTypes.bool.isRequired,
};
