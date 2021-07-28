/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Moment from 'moment';

import useTheme from '../../../theme/hooks/useTheme';
import { accountActions } from '../../../reducers/accounts-reducer';

const StatementsScreen = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { params } = route;
  const accountId = _.get(params, 'accountId', '');
  const statements = _.get(params, 'statements', []);
  const { Gutters, Fonts, Common, Layout, Colors, Images } = useTheme();

  const _loadMyStatements = () => {
    dispatch(accountActions.getAccountStatementsAction(accountId));
  };

  const onSelectStatement = (statement) => {
    navigation.navigate('StatementView', { statement });
  };

  const viewStatementItem = ({ item }) => {
    return (
      <View
        style={[Common.textInputWithShadow, Gutters.tinyMargin, Gutters.smallPadding, Layout.row]}
      >
        <TouchableOpacity
          onPress={() => onSelectStatement(item)}
          style={[Layout.rowBetween, Gutters.largeRMargin]}
        >
          <View style={styles.infoBox}>
            <Text style={[styles.texts, { fontSize: 13 }]}>
              {Moment(`${_.get(item, 'year', '')}/${_.get(item, 'month', '')}`).format('MMMM YYYY')}
            </Text>
            <Text style={[styles.texts, Gutters.tinyBPadding, { fontSize: 13 }]}>
              {_.get(item, 'status', '')}
            </Text>
          </View>
          <Text style={[styles.texts, { color: Colors.primary }]}>{_.get(item, 'date', '')}</Text>
        </TouchableOpacity>
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
          data={statements}
          renderItem={viewStatementItem}
          keyExtractor={(item, index) => _.get(item, 'obj_id', index)}
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

const styles = StyleSheet.create({
  infoBox: {
    width: '78%',
  },
  texts: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default StatementsScreen;
