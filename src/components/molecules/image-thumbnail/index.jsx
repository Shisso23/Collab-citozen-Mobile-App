import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text, Avatar } from 'react-native-elements';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { Colors } from '../../../theme/Variables';
import { useTheme } from '../../../theme';
import { promptConfirm } from '../../../helpers/prompt.helper';

const ImageThumbnail = ({ media, deleteImage = () => null }) => {
  const { Gutters, Layout, Common } = useTheme();

  const promptDelete = () => {
    promptConfirm('', 'Are you sure you want to delete this item?', 'Delete', () =>
      deleteImage(media.uri),
    );
  };

  return (
    <>
      {!_.isEmpty(media.uri) && (
        <View
          style={[
            Layout.rowBetween,
            Common.inputWithRoundBorders,
            Layout.alignItemsCenter,
            Gutters.regularRPadding,
            styles.container,
          ]}
        >
          <Avatar source={{ uri: media.uri }} title="uri" containerStyle={styles.avatar} />
          <Text numberOfLines={2} style={[styles.imageUri, Gutters.smallHMargin]}>
            {`${media.uri.slice(0, 15)}...${media.uri.slice(-11)}\n`}
            <Text style={[styles.imageSize, Common.android60PercentWhite]}>
              {_.get(media, 'size', 0) > 1024
                ? `${_.get(media, 'size', 0) / 1000} MB`
                : `${_.get(media, 'size', 0)} KB`}
            </Text>
          </Text>

          <Icon
            name="trash-o"
            type="font-awesome"
            size={22}
            color={Colors.white}
            onPress={promptDelete}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: Colors.primary,
    borderRadius: 15,
    height: 60,
    overflow: 'hidden',
    width: 63,
  },
  container: {
    backgroundColor: Colors.softBlue,
    borderRadius: 15,
    bottom: 18,
    minHeight: 60,
    width: '100%',
  },
  imageSize: { color: Colors.white, opacity: 0.5 },
  imageUri: { color: Colors.white, fontSize: 14, maxHeight: 35 },
});

ImageThumbnail.propTypes = {
  media: PropTypes.object.isRequired,
  deleteImage: PropTypes.func.isRequired,
};
export default ImageThumbnail;
