import _ from 'lodash';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, useWindowDimensions } from 'react-native';
import { Paragraph } from 'react-native-paper';
import { Divider } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import HTML from 'react-native-render-html';
import { userHasOpenedNewsFeedAction } from '../../../reducers/news-feed-reducer/news-feed.actions';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const { width: screenWidth } = Dimensions.get('window');
const NewsFeedArticle = (newsFeedArticle) => {
  const { Gutters, Fonts } = useTheme();
  const dispatch = useDispatch();
  const newsFeedItem = _.get(newsFeedArticle, 'NewsFeedArticle.newsFeedItem');
  const { user } = useSelector((reducers) => reducers.userReducer);
  const bodyText = newsFeedItem.body;
  const { width } = useWindowDimensions();
  const isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);

  useEffect(() => {
    _openNewsFeed();
  }, []);

  const _openNewsFeed = async () => {
    await dispatch(userHasOpenedNewsFeedAction(newsFeedItem.newsFeedId, user.user_id));
  };

  return (
    <View style={Gutters.regularHMargin}>
      {newsFeedItem.newsFeedImage != null ? (
        <Image source={{ uri: newsFeedItem.newsFeedImage }} style={styles.imageStyle} />
      ) : null}
      <Divider color={Colors.transparent} />
      <Text style={Gutters.regularTMargin}>
        {moment(_.get(newsFeedItem, 'date', new Date())).format('YYYY/MM/DD HH:mm')}
      </Text>
      <Divider color={Colors.transparent} />
      <Text style={Fonts.titleRegular}>{`${newsFeedItem.title}`}</Text>
      <Divider color={Colors.transparent} />
      <View style={Gutters.regularVMargin}>
        {(isHTML && <HTML contentWidth={width} source={{ html: bodyText }} />) || (
          <Paragraph style={Fonts.textLarge}>{bodyText}</Paragraph>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: screenWidth * 0.5,
    resizeMode: 'cover',
    width: '100%',
  },
});

export default NewsFeedArticle;
