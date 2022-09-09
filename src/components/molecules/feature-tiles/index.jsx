import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import useTheme from '../../../theme/hooks/useTheme';
import FeatureTile from '../../atoms/feature-tile';

const FeatureTilesContainer = ({
  onChannelTilePress,
  onServiceRequestTilePress,
  onNewsTilePress,
  onContactsTilePress,
  onAccountsTilePress,
}) => {
  const { Gutters, Layout, Images } = useTheme();

  const renderfeatureTiles = () => {
    return (
      <View style={styles.tilesContainer}>
        <FeatureTile
          description="Channels"
          backgroundImage={Images.channels}
          onPress={onChannelTilePress}
          visible // TODO
        />
        <FeatureTile
          description={'Service\nRequest'}
          backgroundImage={Images.serviceRequestImage}
          onPress={onServiceRequestTilePress}
          imageWidth={40}
          imageHeight={40}
          visible // TODO
        />
        <FeatureTile
          description="News"
          backgroundImage={Images.newsImage}
          imageWidth={40}
          imageHeight={40}
          onPress={onNewsTilePress}
          visible // TODO
        />
        <FeatureTile
          description="Contacts"
          backgroundImage={Images.contactsImage}
          imageWidth={40}
          imageHeight={40}
          onPress={onContactsTilePress}
          visible // TODO
        />
        <FeatureTile
          description=""
          backgroundImage={Images.accountsImage}
          imageWidth={40}
          imageHeight={40}
          onPress={onAccountsTilePress}
          visible // TODO
        />
      </View>
    );
  };

  return (
    <View style={Gutters.smallTMargin}>
      <View style={[styles.categoriesView, Layout.rowBetween, Layout.alignItemsStart]}>
        {renderfeatureTiles()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tilesContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

FeatureTilesContainer.propTypes = {
  onChannelTilePress: PropTypes.func.isRequired,
  onServiceRequestTilePress: PropTypes.func.isRequired,
  onNewsTilePress: PropTypes.func.isRequired,
  onContactsTilePress: PropTypes.func.isRequired,
  onAccountsTilePress: PropTypes.func.isRequired,
};

export default FeatureTilesContainer;
