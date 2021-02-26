import React from 'react';
import { ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import useTheme from '../../../../theme/hooks/useTheme';
import ServiceRequestDetails from '../../../../components/common/service-request-details';

const ViewServiceRequestScreen = () => {
  const { params } = useRoute();
  const { serviceRequest } = params;
  const { Gutters } = useTheme();
  return (
    <ScrollView style={[Gutters.regularMargin]}>
      <ServiceRequestDetails serviceRequest={serviceRequest} />
    </ScrollView>
  );
};
ViewServiceRequestScreen.propTypes = {};

ViewServiceRequestScreen.defaultProps = {};
export default ViewServiceRequestScreen;
