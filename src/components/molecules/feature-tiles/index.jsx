import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import { myChannelsSelector } from '../../../reducers/my-channels/my-channels.reducer';
import { getMyChannelsAction } from '../../../reducers/my-channels/my-channels.actions';
import FeatureTile from '../../atoms/feature-tile';

const FeatureTilesContainer = ({
  onChannelTilePress,
  onServiceRequestTilePress,
  onNewsTilePress,
  onContactsTilePress,
  onAccountsTilePress,
}) => {
  const { Gutters, Layout, Images } = useTheme();
  const dispatch = useDispatch();
  const [accountApplicableChannels, setAccountApplicableChannels] = useState([]);
  const { myChannels } = useSelector(myChannelsSelector);

  useFocusEffect(
    React.useCallback(() => {
      _loadMyChannels();
    }, []),
  );
  useEffect(() => {
    setAccountApplicableChannels(
      myChannels.filter((channel) => _.get(channel, 'accountApplicable', null) === true),
    );
  }, [JSON.stringify(myChannels)]);

  const _loadMyChannels = () => {
    dispatch(getMyChannelsAction()).then((response) => {
      setAccountApplicableChannels(
        response.filter((channel) => _.get(channel, 'accountApplicable', null) === true),
      );
    });
  };

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
          description={'Service\nRequests'}
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
        {accountApplicableChannels.length > 0 && (
          <FeatureTile
            description="Accounts"
            backgroundImage={Images.accountsImage}
            onPress={onAccountsTilePress}
          />
        )}
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
};

export default FeatureTilesContainer;
