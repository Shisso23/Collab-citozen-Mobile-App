import React, { useEffect, createRef, useState } from 'react';
import { StyleSheet, Text, ImageBackground } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Modal, Button, Portal } from 'react-native-paper';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import useTheme from '../../../../theme/hooks/useTheme';
import ServiceRequestDetails from '../../../../components/common/service-request-details';
import { Colors } from '../../../../theme/Variables';
import {
  setImagesSources,
  uploadServiceRequestImages,
} from '../../../../reducers/service-request-reducer/service-request.actions';
import UploadDocumentButton from '../../../../components/molecules/upload-document-button';
import CustomCarousel from '../../../../components/molecules/custom-carousel';
import Comments from '../../../../components/molecules/service-request-comments';
import { serviceRequestService } from '../../../../services';
import { setTabBarVisibilityAction } from '../../../../reducers/navigation-reducer/navigation.actions';

const ViewServiceRequestScreen = () => {
  const { params } = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const keyBoardAwareRef = createRef(null);
  const { serviceRequest } = params;
  const [visible, setVisible] = React.useState(false);
  const { user } = useSelector((reducers) => reducers.userReducer);
  const [isLoadingFollowSR, setIsLoadingFollowSR] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const { Gutters, Fonts, Common, Images, Layout } = useTheme();
  const serviceRequestImages = serviceRequest.serviceRequestImage;

  useEffect(() => {
    dispatch(setTabBarVisibilityAction(true));
    dispatch(setImagesSources([]));
  }, []);

  const _uploadPhotos = (images) => {
    dispatch(uploadServiceRequestImages(serviceRequest.id, images));
    navigation.popToTop();
  };

  const onSendComment = async (comment) => {
    await serviceRequestService.addNewComment(serviceRequest.id, comment);
  };

  const handleFollowSR = (serviceRequestObjId, following) => () => {
    setIsLoadingFollowSR(true);
    serviceRequestService
      .followServiceRequest({
        userId: user.user_id,
        serviceRequestId: serviceRequestObjId,
        followed: following,
      })
      .then(() => {
        navigation.goBack();
      })
      .finally(() => {
        setIsLoadingFollowSR(false);
      });
  };

  return (
    <ImageBackground
      source={Images.serviceRequest}
      style={[Layout.fullSize, Gutters.regularBPadding]}
      resizeMode="cover"
    >
      <KeyboardAwareScrollView
        scrollIndicatorInsets={{ right: 1 }}
        keyboardShouldPersistTaps="always"
        enableOnAndroid
        nestedScrollEnabled
        scrollEnabled={scrollEnabled}
        contentContainerStyle={Gutters.smallHorizontalPadding}
        ref={keyBoardAwareRef}
      >
        <Text style={[Gutters.regularMargin, Fonts.titleTiny]}>Service Request</Text>
        {user.user_id?.trim() !== serviceRequest.ownerId.trim() && (
          <Button
            mode="outlined"
            color={Colors.white}
            style={[
              Gutters.smallRMargin,
              ...[
                { backgroundColor: Colors.primary, height: 30, width: 120, alignSelf: 'flex-end' },
              ],
            ]}
            labelStyle={[Fonts.textSmall, Common.whiteText]}
            loading={isLoadingFollowSR}
            onPress={handleFollowSR(serviceRequest.id, false)}
          >
            Unfollow
          </Button>
        )}
        <ServiceRequestDetails serviceRequest={serviceRequest} />
        {_.isEmpty(serviceRequest.serviceRequestImage) ? null : (
          <Button
            mode="outlined"
            icon="eye"
            color={Colors.white}
            disabled={user.user_id?.trim() !== serviceRequest.ownerId?.trim()}
            style={[Gutters.regularMargin, styles.button]}
            labelStyle={[Fonts.textRegular, Common.whiteText]}
            onPress={() => {
              showModal();
            }}
          >
            View Image{serviceRequestImages.length > 1 ? 's' : ''}
          </Button>
        )}
        {_.get(serviceRequest, 'serviceRequestImage', null) ? null : (
          <UploadDocumentButton
            title="Take Photo"
            style={[Gutters.regularMargin, styles.button]}
            disabled={
              _.get(serviceRequest, 'status', '') === 'Completed' ||
              _.get(serviceRequest, 'status', '') === 'Submitted' ||
              user.user_id?.trim() !== serviceRequest.ownerId?.trim()
            }
            onImageSelect={(images) => _uploadPhotos(images)}
          />
        )}

        {!_.isEmpty(serviceRequest.serviceRequestImage) &&
        serviceRequest.status !== 'Submitted' &&
        serviceRequest.status !== 'Completed' ? (
          <UploadDocumentButton
            title="Add Images"
            style={[Gutters.regularMargin, styles.button]}
            disabled={
              _.get(serviceRequest, 'status', '') === 'Submitted' ||
              user.user_id?.trim() !== serviceRequest.ownerId?.trim()
            }
            onImageSelect={(images) => _uploadPhotos(images)}
          />
        ) : null}
        {(user.user_id?.trim() === serviceRequest.ownerId?.trim() && (
          <Comments
            parentScrollViewRef={keyBoardAwareRef}
            setScrollEnabled={setScrollEnabled}
            onSend={onSendComment}
            serviceRequest={serviceRequest}
          />
        )) || <></>}

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.containerStyle}
          >
            <CustomCarousel sources={serviceRequestImages} isHttpUrl />
          </Modal>
        </Portal>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};
ViewServiceRequestScreen.propTypes = {};

ViewServiceRequestScreen.defaultProps = {};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
  },
  containerStyle: {
    backgroundColor: Colors.white,
    padding: 10,
  },
});
export default ViewServiceRequestScreen;
