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
import { myChannelsSelector } from '../../../reducers/my-channels/my-channels.reducer';
import appConfig from '../../../config';
import storageService from '../../../services/sub-services/storage-service/storage.service';
import {
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
  const [randomNumber, setRandomNumber] = useState(0);
  const [firstLoad, setFirstLoad] = useState(true);
  let asyncStorageBannerImages = [];

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
        let hold = await AsyncStorage.getItem(`@importedBannerImage${index}`);
        asyncStorageBannerImages.push(hold);
        return asyncStorageBannerImages;
      }),
    );
    setRandomNumber(Math.floor(Math.random() * (3 - 1 + 1) + 1) - 1);
    setCurrentImage(JSON.parse(asyncStorageBannerImages[randomNumber]));
    dispatch(setImportedBannerImagesChannelsAction(asyncStorageBannerImages));
  };

  useEffect(() => {
    if (loadedBannerImages && importedBannerImagesChannels.length !== 0) {
      if (firstLoad) {
        setCurrentImage(JSON.parse(importedBannerImagesChannels[randomNumber]));
        setFirstLoad(false);
      }
      const interval = setInterval(() => {
        const shuffledImages = _.shuffle(importedBannerImagesChannels);
        setCurrentImage(JSON.parse(shuffledImages[0]));
        const i = Math.floor(Math.random() * (3 - 1 + 1) + 1) - 1;
        setRandomNumber(i);
      }, 10000);
      return () => {
        clearInterval(interval);
      };
    }
    return undefined;
  });

  useLayoutEffect(() => {
    dispatch(getServiceRequestsAction);

    if (!loadedBannerImages) {
      getToken().then((token) => {
        myChannels.map((channel) => {
          const tempImages = [];
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
          storeImagesAndCycle(tempImages);
          dispatch(setLoadedBannerImagesAction(true));
          return undefined;
        });
      });
    }
  }, []);

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
      <ImageBackground
        source={currentImage}
        defaultSource={defaultBannerImages[randomNumber]}
        resizeMode="cover"
        style={[Common.headerIcon, Layout.column]}
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
