import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, Badge } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Colors } from '../../../theme/Variables';

const NotificationHeader = ({ style }) => {
  const navigation = useNavigation();
  const { hasUnseen } = useSelector((reducers) => reducers.notificationReducer);

  return (
    <>
      <TouchableOpacity style={style} onPress={() => navigation.navigate('Inbox')}>
        <Icon
          type="font-awesome-5"
          name="bell"
          size={23}
          color={Colors.black}
          containerStyle={styles.iconContainerStyle}
        />

        {hasUnseen && <Badge containerStyle={styles.badgeContainerStyle} />}
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
