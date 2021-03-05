import React from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Image } from 'react-native-elements';
import { Modal, Button, Portal } from 'react-native-paper';
import _ from 'lodash';
import useTheme from '../../../../theme/hooks/useTheme';
import ServiceRequestDetails from '../../../../components/common/service-request-details';
import { Colors } from '../../../../theme/Variables';

const { width, height } = Dimensions.get('window');
const ViewServiceRequestScreen = () => {
  const { params } = useRoute();
  const { serviceRequest } = params;
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const { Gutters, Fonts, Common } = useTheme();
  return (
    <ScrollView style={[Common.defaultBackGround]}>
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
