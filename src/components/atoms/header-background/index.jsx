import React, { useEffect, useState, useLayoutEffect } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line import/no-cycle
import useTheme from '../../../theme/hooks/useTheme';
import { NotificationHeader } from '../../headers';
import { getServiceRequestsAction } from '../../../reducers/service-request-reducer/service-request.actions';
import appConfig from '../../../config';
import storageService from '../../../services/sub-services/storage-service/storage.service';
import {
  myChannelsSelector,
  setLoadedBannerImagesAction,
  setImportedBannerImagesChannelsAction,
} from '../../../reducers/my-channels/my-channels.reducer';

const HeaderBackGround = (props) => {
  const { backButton, onBack } = props;
  const { Images, Common, Gutters, Layout, Colors } = useTheme();
  const { apiUrl } = appConfig;
  const { myChannels, loadedBannerImages, importedBannerImagesChannels } =
    useSelector(myChannelsSelector);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const defaultBannerImages = [
    Images.skylineBackground,
    Images.skylineBackground1,
    Images.skylineBackground2,
  ];
  const [bannerImageObjectAndFileIds, setBannerImageObjectAndFileIds] = useState([]);
  const [currentImage, setCurrentImage] = useState();
  const [firstLoad, setFirstLoad] = useState(true);
  const [useDefault, setUseDefault] = useState(false);
  const asyncStorageBannerImages = [];

  const getToken = async () => {
    return storageService.getAccessToken();
  };

  const getBannerImages = ({ objId, fileId, token, channelId }) => {
    return {
      uri: `${apiUrl}/File/Get?objid=${objId}&fileid=${fileId}`,
      timeout: 20000,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      channelId,
    };
  };

  const storeImagesAndCycle = async (images) => {
    await Promise.all(
      images.map(async (imgs, index) => {
        await AsyncStorage.setItem(`@importedBannerImage${index}`, JSON.stringify(imgs));
        const hold = await AsyncStorage.getItem(`@importedBannerImage${index}`);
        asyncStorageBannerImages.push(hold);
        return asyncStorageBannerImages;
      }),
    );
    setCurrentImage(JSON.parse(asyncStorageBannerImages[0]));
    dispatch(setImportedBannerImagesChannelsAction(asyncStorageBannerImages));
  };

  useEffect(() => {
    if (loadedBannerImages && importedBannerImagesChannels.length !== 0) {
      if (firstLoad) {
        setCurrentImage(JSON.parse(importedBannerImagesChannels[0]));
        setFirstLoad(false);
      }
      const interval = setInterval(() => {
        const shuffledImages = _.shuffle(importedBannerImagesChannels);
        setCurrentImage(JSON.parse(shuffledImages[0]));
      }, 10000);
      return () => {
        clearInterval(interval);
      };
    }
    return undefined;
  });

  const loadBannerImages = () => {
    getToken().then((token) => {
      if (myChannels.length === 0) {
        setUseDefault(true);
      } else {
        const tempImages = [];
        _.map(myChannels, function (channel, channelCounter) {
          if (channel.bannerImages !== null) {
            setBannerImageObjectAndFileIds([
              ...bannerImageObjectAndFileIds,
              ..._.get(channel, 'bannerImages', []),
            ]);
            const ObjectAndFileIds = [
              ...bannerImageObjectAndFileIds,
              ..._.get(channel, 'bannerImages', []),
            ];
            ObjectAndFileIds.map((objectAndFileId) => {
              tempImages.push(
                getBannerImages({
                  objId: _.get(objectAndFileId, 'obj_id', null),
                  fileId: _.get(objectAndFileId, 'file_id', null),
                  token,
                  channelId: channel.objId,
                }),
              );
              return undefined;
            });
            if (channelCounter >= myChannels.length - 1) {
              storeImagesAndCycle(tempImages);
              dispatch(setLoadedBannerImagesAction(true));
            }
            return undefined;
          }
          return undefined;
        });
      }
    });
  };

  useLayoutEffect(() => {
    setUseDefault(!myChannels.length);
    dispatch(getServiceRequestsAction());
    loadBannerImages();
  }, [myChannels.length]);

  const handleOnPress = () => {
    if (onBack && backButton) {
      return onBack();
    }
    if (backButton) {
      return navigation.goBack();
    }

    return navigation.toggleDrawer();
  };

  return (
    <View>
      {useDefault ? (
        <ImageBackground
          source={defaultBannerImages[0]}
          defaultSource={defaultBannerImages[0]}
          resizeMode="cover"
          style={[Common.headerIcon, Layout.column, styles.transitionIDK]}
        >
          <IconButton
            icon={backButton ? 'arrow-left' : 'menu'}
            size={30}
            color={Colors.white}
            onPress={handleOnPress}
            style={Gutters.largeTMargin}
          />
          <NotificationHeader style={styles.notificationHeader} />
        </ImageBackground>
      ) : (
        <ImageBackground
          source={currentImage}
          resizeMode="cover"
          style={[Common.headerIcon, Layout.column, styles.transitionIDK]}
        >
          <IconButton
            icon={backButton ? 'arrow-left' : 'menu'}
            size={30}
            color={Colors.white}
            onPress={handleOnPress}
            style={Gutters.largeTMargin}
          />
          <NotificationHeader style={styles.notificationHeader} />
        </ImageBackground>
      )}
    </View>
  );
};

HeaderBackGround.propTypes = {
  backButton: PropTypes.bool,
  onBack: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};

HeaderBackGround.defaultProps = {
  backButton: false,
  onBack: false,
};

const styles = StyleSheet.create({
  notificationHeader: { position: 'absolute', right: 0, top: '37%' },
});

export default HeaderBackGround;
