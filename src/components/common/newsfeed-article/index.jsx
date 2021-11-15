import _ from 'lodash';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Paragraph } from 'react-native-paper';
import { Image, Divider } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { userHasOpenedNewsFeedAction } from '../../../reducers/news-feed-reducer/news-feed.actions';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const { width: screenWidth } = Dimensions.get('window');
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

  return (
    <View style={Gutters.regularHMargin}>
      {newsFeedItem.newsFeedImage != null ? (
        <View style={styles.imageContainer}>
          <Image source={newsFeedItem.newsFeedImage} style={styles.imageStyle} />
        </View>
      ) : null}
      <Divider color={Colors.transparent} />
      <Text style={Gutters.regularTMargin}>
        {moment(_.get(newsFeedItem, 'date', new Date())).format('YYYY/MM/DD HH:mm')}
      </Text>
      <Divider color={Colors.transparent} />
      <Text style={Fonts.titleRegular}>{`${newsFeedItem.title}`}</Text>
      <Divider color={Colors.transparent} />
      <Paragraph style={Fonts.textLarge}>{bodyText}</Paragraph>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: screenWidth * 0.6,
    width: '100%',
  },
  imageStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 245,
    resizeMode: 'stretch',
    width: undefined,
  },
});

export default NewsFeedArticle;
