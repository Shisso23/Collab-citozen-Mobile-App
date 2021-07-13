import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, Badge } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Colors } from '../../../theme/Variables';

const NotificationHeader = ({ style }) => {
  const navigation = useNavigation();
  const { unseenNotifications } = useSelector((reducers) => reducers.notificationReducer);
  const { hasUnseen, unseenCount } = unseenNotifications;

  return (
    <>
      <TouchableOpacity style={style} onPress={() => navigation.navigate('Inbox')}>
        <Icon
          type="font-awesome-5"
          name="bell"
          size={23}
          color={Colors.white}
          containerStyle={styles.iconContainerStyle}
        />

        {hasUnseen && (
          <Badge containerStyle={styles.badgeContainerStyle} value={`${unseenCount}`} />
        )}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  badgeContainerStyle: {
    position: 'absolute',
    right: 12,
    top: -6,
  },
  iconContainerStyle: {
    marginRight: 15,
  },
});

NotificationHeader.propTypes = {
  style: PropTypes.object,
};

NotificationHeader.defaultProps = {
  style: {},
};

export default NotificationHeader;
