import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { FlatList, Text, View, ImageBackground, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { List } from 'react-native-paper';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Moment from 'moment';

import useTheme from '../../../theme/hooks/useTheme';
import { accountActions } from '../../../reducers/accounts-reducer';
import { constructStatementModels } from '../../../models/app/accounts/statement.model';

const StatementsScreen = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { params } = route;
  const { account } = params;
  const accountId = useMemo(() => _.get(account, 'accountId', ''), []);
  const accountName = useMemo(() => _.get(account, 'accountName', ''), []);
  const statements = _.get(params, 'statements', []);
  const [statementsWithPdfFiles, setStatementsWithPdfFiles] = useState([]);
  const { Gutters, Fonts, Common, Layout, Colors, Images } = useTheme();

  const _loadMyStatements = () => {
    dispatch(accountActions.getAccountStatementsAction(accountId));
  };

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
    navigation.navigate('StatementView', { statement });
  };

  const viewStatementItem = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.smallVMargin]}>
        <List.Item
          title={Moment(`${_.get(item, 'year', '')}/${_.get(item, 'month', '')}`).format(
            'MMMM YYYY',
          )}
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
        <Text style={[Gutters.smallMargin, Fonts.textLeft]}>{accountName}</Text>

        <FlatList
          contentContainerStyle={Gutters.smallHMargin}
          data={statementsWithPdfFiles}
          renderItem={viewStatementItem}
          keyExtractor={(item, index) => `${_.get(item, 'objectId', index)}`}
          refreshControl={
            <RefreshControl
              onRefresh={_loadMyStatements}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        />
      </ImageBackground>
    </>
  );
};

StatementsScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

StatementsScreen.defaultProps = {};

export default StatementsScreen;
