import React, { useState, useEffect } from 'react';
import { List } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FlatList, Text, View, ImageBackground, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import useTheme from '../../../theme/hooks/useTheme';
import { accountsSelector } from '../../../reducers/accounts-reducer/accounts.reducer';
import { accountActions } from '../../../reducers/accounts-reducer';
import HeaderBackGround from '../../../components/atoms/header-background';
import Accounts from '../../../components/molecules/accounts/Accounts';

const AccountsScreen = () => {
  const dispatch = useDispatch();
  const { accountChannels, isLoadingAccountChannels } = useSelector(accountsSelector);
  const { Common, Gutters, Fonts, Layout, Images, Colors } = useTheme();
  const [showAccounts, setshowAccounts] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState({});
  const navigation = useNavigation();

  const _loadMyChannels = () => {
    dispatch(accountActions.getChannelsWithValidAccountsAction());
  };

  useFocusEffect(
    React.useCallback(() => {
      _loadMyChannels();
    }, []),
  );

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <HeaderBackGround {...props} backButton onBack={onBack} />,
    });
  }, [showAccounts]);

  const onBack = () => {
    if (showAccounts) {
      setshowAccounts(false);
    } else {
      navigation.goBack();
    }
  };

  const onSelectChannel = (channel) => {
    setshowAccounts(true);
    setSelectedChannel(channel);
  };

  const _getStatusIndicator = (status) => {
    switch (status) {
      case 'Subscribed':
        return Colors.primary;
      case 'pending':
        return Colors.error;
      default:
        return Colors.primary;
    }
  };

  const viewAccountChannelsItem = ({ item }) => {
    return (
      <View style={[Common.textInputWithShadow, Gutters.tinyMargin]}>
        <List.Item
          title={item.name}
          onPress={() => onSelectChannel(item)}
          description={() => (
            <View style={[Layout.column, Gutters.largeRMargin]}>
              <View style={[Layout.rowHCenter, Gutters.tinyTPadding]}>
                <View
                  style={[
                    Gutters.tinyHMargin,
                    Common.statusIndicator,
                    { backgroundColor: _getStatusIndicator(item.status) },
                  ]}
                />
                <Text style={Fonts.textRegular}>Subscribed</Text>
              </View>
            </View>
          )}
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
        <Text style={[Gutters.smallMargin, Fonts.titleTiny]}>My Accounts</Text>
        {(!showAccounts && (
          <FlatList
            contentContainerStyle={Gutters.smallHMargin}
            data={accountChannels}
            renderItem={viewAccountChannelsItem}
            keyExtractor={(item) => String(item.objId)}
            refreshControl={
              <RefreshControl
                refreshing={isLoadingAccountChannels}
                onRefresh={_loadMyChannels}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
          />
        )) || <Accounts selectedChannel={selectedChannel} />}
      </ImageBackground>
    </>
  );
};

AccountsScreen.propTypes = {};

AccountsScreen.defaultProps = {};

export default AccountsScreen;
