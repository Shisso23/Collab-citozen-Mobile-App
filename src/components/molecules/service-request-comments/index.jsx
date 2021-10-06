import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import { TextInput } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import Moment from 'moment';
import _ from 'lodash';

import PropTypes from 'prop-types';
import { Colors } from '../../../theme/Variables';
import useTheme from '../../../theme/hooks/useTheme';
import CustomInput from '../custom-input';
import { getCommentsAction } from '../../../reducers/service-request-reducer/service-request.actions';
import { serviceRequestSelector } from '../../../reducers/service-request-reducer/service-request.reducer';

const { width } = Dimensions.get('window');
const Comments = ({ serviceRequest, onSend }) => {
  const { user } = useSelector((reducers) => reducers.userReducer);
  const { comments } = useSelector(serviceRequestSelector);
  const dispatch = useDispatch();

  const { Gutters } = useTheme();
  const [comment, setComment] = useState('');

  useLayoutEffect(() => {
    dispatch(getCommentsAction(serviceRequest.id));
    const interval = setInterval(() => {
      dispatch(getCommentsAction(serviceRequest.id));
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // const getInitials = (name) => {
  //   const names = name.split(' ');
  //   let initials = names[0].substring(0, 1).toUpperCase();

  //   if (names.length > 1) {
  //     initials += names[names.length - 1].substring(0, 1).toUpperCase();
  //   }
  //   return initials;
  // };

  // const checkIsExtraComment = (currentIndex, _comments) => {
  //   if (currentIndex > 0 && _comments[currentIndex - 1].from === _comments[currentIndex].from) {
  //     setIsExtraMessage(true);
  //   } else {
  //     setIsExtraMessage(false);
  //   }
  // };

  const formatDate = (date) => {
    return Moment(date).fromNow();
  };

  const renderComment = (item) => {
    const date = _.get(item, 'date');
    const entityName =
      _.get(item, 'origin', '') === 'Channel'
        ? _.get(serviceRequest, 'address', 'Channel')
        : _.get(user, 'fullName', '');

    return (
      <>
        <ListItem containerStyle={styles.container}>
          {/* {_.get(item, 'origin', '') === 'Channel' && (
            <Avatar
              rounded
              title={getInitials(entityName)}
              size={40}
              titleStyle={{ color: Colors.white }}
              containerStyle={[
                styles.avatar,
                Gutters.largeBMargin,
                {
                  backgroundColor:
                    _.get(item, 'origin', '') === 'Channel' ? Colors.softBlue : Colors.gray,
                },
              ]}
            />
          )} */}
          <ListItem.Content>
            <ListItem.Title>
              {_.get(item, 'origin', '') !== 'Channel' ? 'You' : entityName}
            </ListItem.Title>
            <ListItem.Subtitle>{formatDate(date)}</ListItem.Subtitle>
            <ListItem.Subtitle style={Gutters.smallTMargin}>
              {_.get(item, 'comment', '')}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
        <Divider style={styles.fullDivider} />
      </>
    );
  };

  return (
    <View style={Gutters.regularHMargin}>
      <Text style={[Gutters.smallBMargin, styles.commentsText]}>Comments ({comments.length})</Text>

      {_.map(comments, renderComment)}
      <CustomInput
        value={comment}
        placeholder="Type a comment"
        onChangeText={(text) => setComment(text)}
        returnKeyType="done"
        right={
          <TextInput.Icon
            name="send-outline"
            type="ionicon"
            onPress={() => {
              onSend(comment).then(() => {
                setComment('');
                dispatch(getCommentsAction(serviceRequest.id));
              });
            }}
            disabled={comment.length === 0}
            color={comment.length > 0 ? Colors.primary : Colors.darkgray}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  commentsText: { fontSize: 17, fontWeight: '500' },
  fullDivider: { height: 1, width: width * 0.92 },
});

Comments.propTypes = {
  serviceRequest: PropTypes.object.isRequired,
  onSend: PropTypes.func.isRequired,
};

Comments.defaultProps = {};

export default Comments;
