import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import useTheme from '../../../../theme/hooks/useTheme';
import { LoadingComponent } from '../../../../components/molecules';
import { CreateServiceRequestForm } from '../../../../components/forms';
import {
  createServiceRequestAction,
  getServiceRequestsAction,
  setImagesSources,
} from '../../../../reducers/service-request-reducer/service-request.actions';
import { flashService } from '../../../../services';
import { createServiceRequestModel } from '../../../../models';
import { municipalitiesSelector } from '../../../../reducers/municipalities-reducer/municipalities.reducer';
import HeaderBackGround from '../../../../components/atoms/header-background/index';
import { promptConfirmDelete } from '../../../../helpers/prompt.helper';
import { Colors } from '../../../../theme/Variables';

const CreateServiceRequestScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [thumNailImages, setThumNailImages] = useState([]);
  const { municipalities } = useSelector(municipalitiesSelector);

  const { Gutters, Common, Layout } = useTheme();

  const _onFormSuccess = async () => {
    flashService.success('Successfully created request');
    await dispatch(getServiceRequestsAction());
    navigation.navigate('ServiceRequests');
  };
  useEffect(() => {
    dispatch(setImagesSources([]));
  }, []);
  const _handleFormSubmit = (form) => {
    return dispatch(createServiceRequestAction(form));
  };
  const handleDeleteImage = (imageToDelete) => {
    promptConfirmDelete('Are you sure you want to delete this item?', () => {
      const remainingImages = thumNailImages.filter((image) => {
        return image.uri !== imageToDelete.uri;
      });
      setThumNailImages(remainingImages);
      dispatch(setImagesSources(remainingImages));
      return remainingImages;
    });
  };
  const renderThumbNails = ({ item }) => {
    return (
      <View key={item.uri} style={[Gutters.largeTMargin, Gutters.smallHMargin]}>
        <ImageBackground
          source={{ uri: item.uri } || null}
          style={[styles.thumbnail, Layout.alignItemsEnd]}
        >
          <Icon
            onPress={() => handleDeleteImage(item)}
            name="times-circle"
            type="font-awesome-5"
            size={30}
            style={[Layout.alignSelfEnd]}
            iconStyle={styles.deleteIcon}
          />
        </ImageBackground>
      </View>
    );
  };

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      style={[Common.defaultBackGround]}
      extraHeight={150}
      enableOnAndroid
    >
      <HeaderBackGround backButton />
      {!_.isEmpty(municipalities) ? (
        <>
          <CreateServiceRequestForm
            submitForm={_handleFormSubmit}
            onSuccess={_onFormSuccess}
            municipalities={municipalities}
            initialValues={createServiceRequestModel()}
            containerStyle={[Gutters.regularHMargin, Gutters.regularTMargin]}
            setThumbNailImages={setThumNailImages}
            thumbNailImages={thumNailImages}
          />
          <FlatList
            style={[Gutters.alignSelfCenter, Gutters.tinyLMargin]}
            data={thumNailImages}
            renderItem={renderThumbNails}
            horizontal
          />
        </>
      ) : (
        <LoadingComponent />
      )}
    </KeyboardAwareScrollView>
  );
};

CreateServiceRequestScreen.propTypes = {};

CreateServiceRequestScreen.defaultProps = {};

const styles = StyleSheet.create({
  deleteIcon: { backgroundColor: Colors.primary, borderRadius: 15, color: Colors.white },
  thumbnail: { borderRadius: 10, height: 90, overflow: 'hidden', width: 115 },
});

export default CreateServiceRequestScreen;
