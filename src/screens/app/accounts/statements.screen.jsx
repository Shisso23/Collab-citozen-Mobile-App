import React, { useEffect, useState } from 'react';
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
  const accountId = _.get(params, 'accountId', '');
  const statements = _.get(params, 'statements', []);
  const [statementsWithPdfFiles, setStatementsWithPdfFiles] = useState([]);
  const { Gutters, Fonts, Common, Layout, Colors, Images } = useTheme();

  const _loadMyStatements = () => {
    dispatch(accountActions.getAccountStatementsAction(accountId));
  };

  useEffect(() => {
    constructStatementModels(statements).then((newStatements) => {
      setStatementsWithPdfFiles(newStatements);
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
