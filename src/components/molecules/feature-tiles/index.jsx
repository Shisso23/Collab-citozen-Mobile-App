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
  accountsTileVisible,
}) => {
  const { Gutters, Layout, Images } = useTheme();

  const renderfeatureTiles = () => {
    return (
      <View
        style={[
          styles.tilesContainer,
          Layout.row,
          Layout.alignItemsCenter,
          Layout.justifyContentCenter,
        ]}
      >
        <FeatureTile
          description="Channels"
          backgroundImage={Images.channels}
          onPress={onChannelTilePress}
        />
        <FeatureTile
          description={'Service\nRequest'}
          backgroundImage={Images.serviceRequestImage}
          onPress={onServiceRequestTilePress}
        />
        <FeatureTile
          description="News"
          backgroundImage={Images.newsImage}
          onPress={onNewsTilePress}
        />
        <FeatureTile
          description="Contacts"
          backgroundImage={Images.contactsImage}
          onPress={onContactsTilePress}
        />
        <FeatureTile
          description=""
          backgroundImage={Images.accountsImage}
          onPress={onAccountsTilePress}
          visible={accountsTileVisible}
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
    flexWrap: 'wrap',
  },
});

FeatureTilesContainer.propTypes = {
  onChannelTilePress: PropTypes.func.isRequired,
  onServiceRequestTilePress: PropTypes.func.isRequired,
  onNewsTilePress: PropTypes.func.isRequired,
  onContactsTilePress: PropTypes.func.isRequired,
  onAccountsTilePress: PropTypes.func.isRequired,
  accountsTileVisible: PropTypes.bool.isRequired,
};

export default FeatureTilesContainer;
