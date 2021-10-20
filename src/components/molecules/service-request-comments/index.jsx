import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, Keyboard, Platform } from 'react-native';
import { ListItem, Overlay } from 'react-native-elements';

import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux';

import PropTypes from 'prop-types';
import { Colors } from '../../../theme/Variables';
import useTheme from '../../../theme/hooks/useTheme';
import { getCommentsAction } from '../../../reducers/service-request-reducer/service-request.actions';
import { serviceRequestSelector } from '../../../reducers/service-request-reducer/service-request.reducer';
import CommentsActionSheetContent from '../comments/action-sheet';

const Comments = ({ serviceRequest, onSend }) => {
  const { comments } = useSelector(serviceRequestSelector);
  const dispatch = useDispatch();

  const { Gutters, Layout } = useTheme();
  const [keyboardVisible, setKeyboardVisible] = useState(undefined);
  const [commentsExpanded, setCommentsExpanded] = useState(false);

  const containerStyle = {
    marginBottom: keyboardVisible ? (Platform.OS === 'ios' ? 50 : 0) : 20,
    flex: 1,
  };

  useLayoutEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    dispatch(getCommentsAction(serviceRequest.id));
    const interval = setInterval(() => {
      dispatch(getCommentsAction(serviceRequest.id));
    }, 10000);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={[containerStyle]}>
      <ListItem.Accordion
        underlayColor={Colors.transparent}
        content={
          <>
            <Text style={[Gutters.smallBMargin, styles.commentsText]}>
              Comments ({comments.length})
            </Text>
          </>
        }
        isExpanded={commentsExpanded}
        onPress={() => {
          setCommentsExpanded(!commentsExpanded);
        }}
      />

      <Overlay isVisible={commentsExpanded} overlayStyle={[styles.overlay, Gutters.largeTMargin]}>
        <View
          style={[
            Gutters.regularVPadding,
            Gutters.smallBMargin,
            Layout.row,
            Layout.alignItemsCenter,
            styles.commentsHeader,
          ]}
        >
          <Text style={styles.commentsTitle}>Comments</Text>
          <Icon
            onPress={() => setCommentsExpanded(false)}
            style={styles.closeButton}
            name="times-circle"
            size={25}
          />
        </View>
        <CommentsActionSheetContent
          closeComments={() => setCommentsExpanded(false)}
          serviceRequest={serviceRequest}
          onSend={onSend}
        />
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  closeButton: { opacity: 0.65, position: 'absolute', right: '0%' },
  commentsHeader: { width: '100%' },
  commentsText: { fontSize: 17, fontWeight: '500' },
  commentsTitle: { fontSize: 18, fontWeight: '500', left: '38%', position: 'absolute' },
  overlay: {
    bottom: 0,
    height: '88.5%',
    position: 'absolute',
    width: '99%',
  },
});

Comments.propTypes = {
  serviceRequest: PropTypes.object.isRequired,
  onSend: PropTypes.func.isRequired,
};

export default Comments;
