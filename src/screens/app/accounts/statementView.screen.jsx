import React from 'react';
import { Text, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import useTheme from '../../../theme/hooks/useTheme';
import AccountStatement from '../../../components/molecules/accounts/AccountStatement';

const StatementViewScreen = ({ route }) => {
  const { params } = route;
  const statement = _.get(params, 'statement', '');
  const { Gutters, Layout, Images } = useTheme();

  return (
    <>
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill, Gutters.smallTMargin]}
        resizeMode="cover"
      >
        <Text style={[Layout.alignSelfCenter, Gutters.smallBPadding]}>
          ({_.get(statement, 'date', '')}) Statement
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
