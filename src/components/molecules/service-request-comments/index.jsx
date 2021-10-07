import React, { useState, useLayoutEffect, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Keyboard } from 'react-native';
import { ListItem } from 'react-native-elements';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { TextInput } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

import PropTypes from 'prop-types';
import { Colors } from '../../../theme/Variables';
import useTheme from '../../../theme/hooks/useTheme';
import CustomInput from '../custom-input';
import { getCommentsAction } from '../../../reducers/service-request-reducer/service-request.actions';
import { serviceRequestSelector } from '../../../reducers/service-request-reducer/service-request.reducer';

const Comments = ({ serviceRequest, onSend }) => {
  const { comments } = useSelector(serviceRequestSelector);
  const dispatch = useDispatch();

  const { Gutters } = useTheme();
  const [comment, setComment] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(undefined);
  const [commentsExpanded, setCommentsExpanded] = useState(false);

  const containerStyle = {
    marginBottom: keyboardVisible ? 100 : 30,
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

  const sendMessage = useCallback((messages = []) => {
    onSend(messages[0].text).then(() => {
      dispatch(getCommentsAction(serviceRequest.id));
      GiftedChat.append(comments, messages);
    });
  }, []);

  return (
    <View style={containerStyle}>
      <ListItem.Accordion
        underlayColor={Colors.transparent}
        content={
          <>
            <Text style={[Gutters.smallBMargin, styles.commentsText]}>
              Comments ({comments.length})
            </Text>
          </>
        }
        containerStyle={{ backgroundColor: Colors.transparent }}
        isExpanded={commentsExpanded}
        onPress={() => {
          setCommentsExpanded(!commentsExpanded);
        }}
      >
        <SafeAreaView style={styles.giftedChat}>
          <GiftedChat
            alignTop
            inverted={false}
            messages={comments}
            placeholder="Type a comment"
            isKeyboardInternallyHandled={false}
            keyboardShouldPersistTaps
            renderBubble={(props) => {
              return (
                <Bubble
                  {...props}
                  wrapperStyle={{
                    right: {
                      backgroundColor: '#538536',
                      marginBottom: 5,
                      padding: 5,
                    },
                    left: {
                      marginBottom: 5,
                      padding: 5,
                    },
                  }}
                />
              );
            }}
            renderInputToolbar={() => (
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
            )}
            onSend={(messages) => sendMessage(messages)}
            user={{
              _id: 1,
            }}
            renderAvatar={() => null}
          />
        </SafeAreaView>
      </ListItem.Accordion>
    </View>
  );
};

const styles = StyleSheet.create({
  commentsText: { fontSize: 17, fontWeight: '500' },
  giftedChat: { height: 500 },
});

Comments.propTypes = {
  serviceRequest: PropTypes.object.isRequired,
  onSend: PropTypes.func.isRequired,
};

Comments.defaultProps = {};

export default Comments;
