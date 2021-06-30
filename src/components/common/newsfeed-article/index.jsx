import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Image, Divider } from 'react-native-elements';

import useTheme from '../../../theme/hooks/useTheme';

const { width: screenWidth } = Dimensions.get('window');

const NewsFeedArticle = (newsFeedArticle) => {
  const { Gutters, Fonts, Colors } = useTheme();
  const newsFeedItem = _.get(newsFeedArticle, 'NewsFeedArticle.newsFeedItem');

  const bodyText = newsFeedItem.body;
  const bodyTextFormatted = bodyText.replace(/\./g, '.\n \n');

  return (
    <View style={Gutters.regularHMargin}>
      <Image source={newsFeedItem.newsFeedImage} style={styles.imageStyle} />
      <Divider color={Colors.transparent} />
      <Text style={Fonts.titleRegular}>{`${newsFeedItem.title}`}</Text>
      <Divider color={Colors.transparent} />
      <Text style={Fonts.textLarge}>{`${bodyTextFormatted}`}</Text>
    </View>
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

NewsFeedArticle.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  newsFeedArticle: PropTypes.object.isRequired,
};

NewsFeedArticle.defaultProps = {};

export default NewsFeedArticle;
