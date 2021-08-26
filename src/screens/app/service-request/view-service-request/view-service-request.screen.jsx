import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  ImageBackground,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image } from 'react-native-elements';
import { Modal, Button, Portal } from 'react-native-paper';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import useTheme from '../../../../theme/hooks/useTheme';
import ServiceRequestDetails from '../../../../components/common/service-request-details';
import { Colors } from '../../../../theme/Variables';
import { uploadServiceRequestImages } from '../../../../reducers/service-request-reducer/service-request.actions';
import UploadDocumentButton from '../../../../components/molecules/upload-document-button';

const { width, height } = Dimensions.get('window');
const ViewServiceRequestScreen = () => {
  const { params } = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { serviceRequest } = params;
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const { Gutters, Fonts, Common, Images, Layout } = useTheme();

  const _uploadPhotos = (images) => {
    dispatch(uploadServiceRequestImages(serviceRequest.id, images));
    navigation.popToTop();
  };

  return (
    <ImageBackground source={Images.serviceRequest} style={[Layout.fullSize]} resizeMode="cover">
      <ScrollView>
        <Text style={[Gutters.regularMargin, Fonts.titleTiny]}>Service Request</Text>
        <ServiceRequestDetails serviceRequest={serviceRequest} />
        {_.isEmpty(serviceRequest.serviceRequestImage) ? null : (
          <Button
            mode="outlined"
            icon="eye"
            color={Colors.white}
            style={[Gutters.regularMargin, styles.button]}
            labelStyle={[Fonts.textRegular, Common.whiteText]}
            onPress={() => {
              showModal();
            }}
          >
            View Image
          </Button>
        )}
        {!_.isEmpty(serviceRequest.serviceRequestImage) ? null : (
          <UploadDocumentButton
            title="Take Photo"
            style={[Gutters.regularMargin, styles.button]}
            disabled={_.get(serviceRequest, 'status', '') === 'Submitted'}
            onImageSelect={(images) => _uploadPhotos(images)}
          />
        )}

        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.containerStyle}
          >
            <Image
              source={serviceRequest.serviceRequestImage}
              style={styles.image}
              PlaceholderContent={<ActivityIndicator />}
            />
          </Modal>
        </Portal>
      </ScrollView>
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
  image: {
    height: height * 0.6,
    width,
  },
});
export default ViewServiceRequestScreen;
