import React from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Image } from 'react-native-elements';
import { Modal, Button, Portal } from 'react-native-paper';
import useTheme from '../../../../theme/hooks/useTheme';
import ServiceRequestDetails from '../../../../components/common/service-request-details';
import { getServiceRequestImageAction } from '../../../../reducers/service-request-reducer/service-request.actions';
import { serviceRequestSelector } from '../../../../reducers/service-request-reducer/service-request.reducer';
import { Colors } from '../../../../theme/Variables';

const { width, height } = Dimensions.get('window');
const ViewServiceRequestScreen = () => {
  const { params } = useRoute();
  const { serviceRequestImage } = useSelector(serviceRequestSelector);
  const { serviceRequest } = params;
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const { Gutters, Fonts, Common } = useTheme();
  return (
    <ScrollView style={[Common.defaultBackGround]}>
      <Text style={[Gutters.regularMargin, Fonts.titleTiny]}>Service Request</Text>
      <ServiceRequestDetails serviceRequest={serviceRequest} />
      <Button
        mode="outlined"
        icon="eye"
        color={Colors.white}
        style={[Gutters.regularMargin, styles.button]}
        labelStyle={[Fonts.textRegular, Common.whiteText]}
        onPress={() => {
          dispatch(getServiceRequestImageAction());
          showModal();
        }}
      >
        View Image
      </Button>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}
        >
          <Image
            source={{ uri: serviceRequestImage }}
            style={styles.image}
            PlaceholderContent={<ActivityIndicator />}
          />
        </Modal>
      </Portal>
    </ScrollView>
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
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    height: height * 0.6,
    width,
  },
});
export default ViewServiceRequestScreen;
