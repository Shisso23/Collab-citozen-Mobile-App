import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  SafeAreaView,
  Platform,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';

import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { TextInput } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

import { useTheme } from '../../../theme';
import { Colors } from '../../../theme/Variables';
import CustomInput from '../custom-input';
import { getCommentsAction } from '../../../reducers/service-request-reducer/service-request.actions';
import { serviceRequestSelector } from '../../../reducers/service-request-reducer/service-request.reducer';

const deviceHeight = Dimensions.get('window').height;
const CommentsActionSheetContent = ({ onSend, serviceRequest }) => {
  const { Gutters, Layout, Images } = useTheme();

  const { comments } = useSelector(serviceRequestSelector);
  const dispatch = useDispatch();
  const [comment, setComment] = useState(false);

  useLayoutEffect(() => {
    dispatch(getCommentsAction(serviceRequest.id));
    const interval = setInterval(() => {
      dispatch(getCommentsAction(serviceRequest.id));
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <ImageBackground
      source={Images.serviceRequest}
      style={[Layout.fullSize, Gutters.regularBPadding]}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? deviceHeight * 0.19 : 0}
      >
        <SafeAreaView style={[styles.commentsModal]}>
          <GiftedChat
            alignTop
            inverted={false}
            infiniteScroll
            messages={comments}
            placeholder="Type a comment"
            isKeyboardInternallyHandled={false}
            keyboardShouldPersistTaps="always"
            renderBubble={(props) => {
              return (
                <Bubble
                  {...props}
                  wrapperStyle={{
                    right: {
                      backgroundColor: '#6e9e52',
                      marginBottom: 5,
                      padding: 5,
                    },
                    left: {
                      marginBottom: 5,
                      padding: 5,
                    },
                  }}
                  textStyle={{
                    right: {
                      fontSize: 14,
                    },
                    left: {
                      fontSize: 14,
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
            user={{
              _id: 1,
            }}
            renderAvatar={() => null}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  commentsModal: {
    height: '95%',
  },
});

CommentsActionSheetContent.propTypes = {
  closeComments: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  serviceRequest: PropTypes.object.isRequired,
};
export default CommentsActionSheetContent;
