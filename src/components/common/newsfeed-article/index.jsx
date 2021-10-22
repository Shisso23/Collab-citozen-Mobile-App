import _ from 'lodash';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image, Divider } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';

import { userHasOpenedNewsFeedAction } from '../../../reducers/news-feed-reducer/news-feed.actions';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const NewsFeedArticle = (newsFeedArticle) => {
  const { Gutters, Fonts } = useTheme();
  const dispatch = useDispatch();
  const newsFeedItem = _.get(newsFeedArticle, 'NewsFeedArticle.newsFeedItem');
  const { user } = useSelector((reducers) => reducers.userReducer);

  useEffect(() => {
    _openNewsFeed();
  }, []);

  const _openNewsFeed = async () => {
    await dispatch(userHasOpenedNewsFeedAction(newsFeedItem.newsFeedId, user.user_id));
  };

  const bodyText = newsFeedItem.body;
  const bodyTextFormatted = bodyText.replace(/\. /g, '.\n \n');

  return (
    <View style={Gutters.regularHMargin}>
      {newsFeedItem.newsFeedImage != null ? (
        <Image source={newsFeedItem.newsFeedImage} style={styles.imageStyle} />
      ) : null}
      <Divider color={Colors.transparent} />
      <Text style={Fonts.titleRegular}>{`${newsFeedItem.title}`}</Text>
      <Divider color={Colors.transparent} />
      <Text style={Fonts.textLarge}>{`${bodyTextFormatted}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    aspectRatio: 1 / 1,
    borderColor: Colors.shadow,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    elevation: 5,
    height: null,
    resizeMode: 'cover',
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 3,
      height: 5,
    },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    width: null,
  },
});

export default NewsFeedArticle;
