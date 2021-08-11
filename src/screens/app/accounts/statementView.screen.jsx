import React from 'react';
import { Text, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Moment from 'moment';

import useTheme from '../../../theme/hooks/useTheme';
import AccountStatement from '../../../components/molecules/add-account/AccountStatement';

const StatementViewScreen = ({ route }) => {
  const { params } = route;
  const statement = _.get(params, 'statement', {});
  const { Gutters, Layout, Images } = useTheme();
  const year = _.get(statement, 'year', '');
  const month = _.get(statement, 'month', '');
  const dateString = `${year}/${month}`;

  return (
    <>
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill, Gutters.smallTMargin]}
        resizeMode="cover"
      >
        <Text style={[Layout.alignSelfCenter, Gutters.smallBPadding]}>
          {Moment(dateString, 'YYYY/MM').format('MMMM YYYY')}
        </Text>

        <AccountStatement statement={statement} />
      </ImageBackground>
    </>
  );
};

StatementViewScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

StatementViewScreen.defaultProps = {};

export default StatementViewScreen;
