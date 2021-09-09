import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, Text, View, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { List } from 'react-native-paper';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Moment from 'moment';

import useTheme from '../../../theme/hooks/useTheme';
import { constructStatementModels } from '../../../models/app/accounts/statement.model';
import { flashService } from '../../../services';

const StatementsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { params } = route;
  const { account } = params;
  const accountName = useMemo(() => _.get(account, 'accountName', ''), []);
  const statements = _.get(params, 'statements', []);
  const [statementsWithPdfFiles, setStatementsWithPdfFiles] = useState([]);
  const { Gutters, Fonts, Common, Layout, Images } = useTheme();

  const sortStatements = (unsortedStatements) => {
    return unsortedStatements.sort((st1, st2) => {
      if (_.get(st1, 'month', '') > _.get(st2, 'month', '')) {
        return -1;
      }
      if (_.get(st1, 'month', '') < _.get(st2, 'month', '')) {
        return 1;
      }
      return 0;
    });
  };

  useEffect(() => {
    constructStatementModels(statements).then((newStatements) => {
      setStatementsWithPdfFiles(sortStatements(newStatements));
    });
  }, []);

  const onSelectStatement = (statement) => {
    if (!_.get(statement, 'statementPdf')) {
      return flashService.info('Statement not yet Available!');
    }
    return navigation.navigate('StatementView', { statement });
  };

  const renderDescription = (item) => {
    return (
      <View style={[Layout.rowBetween, Gutters.smallTMargin]}>
        <Text style={Common.cardDescription}>Outstanding balance</Text>
        <Text style={Common.cardDescription}>
          R{_.get(item, 'outstandingBalance', 0).toFixed(2)}
        </Text>
      </View>
    );
  };

  const viewStatementItem = ({ item }) => {
    const year = _.get(item, 'year', '');
    const month = _.get(item, 'month', '');
    const dateString = `${year}/${month}`;
    return (
      <View style={[Common.textInputWithShadow, Gutters.smallVMargin, styles.statementItem]}>
        <List.Item
          title={Moment(dateString, 'YYYY/MM').format('MMMM YYYY')}
          description={() => renderDescription(item)}
          onPress={() => onSelectStatement(item)}
          titleStyle={Common.cardTitle}
        />
      </View>
    );
  };

  return (
    <>
      <ImageBackground
        source={Images.serviceRequest}
        style={[Layout.fullSize, Layout.fill]}
        resizeMode="cover"
      >
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>My Statements</Text>
        <Text style={[Gutters.smallMargin, Fonts.textLeft, styles.accountName]}>{accountName}</Text>

        <FlatList
          contentContainerStyle={Gutters.smallHMargin}
          data={statementsWithPdfFiles}
          renderItem={viewStatementItem}
          keyExtractor={(item, index) => `${_.get(item, 'objectId', index)}`}
        />
      </ImageBackground>
    </>
  );
};

StatementsScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  accountName: {
    fontWeight: '500',
  },
  statementItem: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 0.16,
  },
});

StatementsScreen.defaultProps = {};

export default StatementsScreen;
