/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

import useTheme from '../../../theme/hooks/useTheme';
import { accountsSelector } from '../../../reducers/accounts-reducer/accounts.reducer';
import { accountActions } from '../../../reducers/accounts-reducer';

const StatementsScreen = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { params } = route;
  const accountId = _.get(params, 'accountId', '');
  const { statements, isLoadingAccountStatements } = useSelector(accountsSelector);
  const { Gutters, Fonts, Common, Layout, Colors, Images } = useTheme();

  useEffect(() => {
    _loadMyStatements();
  }, [statements.length]);

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
            <Text style={[styles.texts, Gutters.tinyBPadding, { fontSize: 13 }]}>
              {_.get(item, 'paid_amount', 0).toFixed(2)}
            </Text>
            <Text style={[styles.texts, { fontSize: 13 }]}>{_.get(item, 'address', '')}</Text>
          </View>
          <Text style={[styles.texts, { color: Colors.primary }]}>{_.get(item, 'date', '')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    // <View style={styles.container}>
    //   <View style={styles.header}>
    //     <IconButton
    //       icon="arrow-left"
    //       size={30}
    //       color={Colors.white}
    //       onPress={() => navigation.goBack()}
    //       style={[Gutters.largeTMargin, Gutters.alignSelfLeft]}
    //     />
    //     <Text
    //       style={[
    //         Gutters.smallMargin,
    //         Fonts.titleTiny,
    //         Layout.alignSelfCenter,
    //         Gutters.largeTMargin,
    //       ]}
    //     >
    //       Statements
    //     </Text>
    //   </View>

    //   <AccountStatement statement={statements} />
    // </View>
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
          keyExtractor={(item) => String(item.objectId)}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingAccountStatements}
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
