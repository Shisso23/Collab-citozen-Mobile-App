import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TextInput, HelperText, Button } from 'react-native-paper';
import { Icon, ListItem } from 'react-native-elements';
import ActionSheet from 'react-native-actions-sheet';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import UploadDocumentButton from '../../../components/molecules/upload-document-button';
import { setImagesSources } from '../../../reducers/service-request-reducer/service-request.actions';
import ConfirmReadingActionSheetContent from '../../../components/molecules/meters/confirm-reading-actionsheet-content';
import { flashService, metersService } from '../../../services';
import ImageThumbnail from '../../../components/molecules/image-thumbnail';

const SubmitMeterReadingScreen = ({ route }) => {
  const { Gutters, Common, Layout } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const actionSheetRef = useRef();
  const [readingNumber, setReadingNumber] = useState('');
  const [readingNumberError, setReadingNumberError] = useState('');
  const [readingPhoto, setReadingPhoto] = useState('');
  const [readingPhotoError, setReadingPhotoError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const channelRef = _.get(route, 'params.channelRef', '');
  const selectedMeter = _.get(route, 'params.meter', {});
  const meterType = _.get(selectedMeter, 'type', '').toLowerCase();
  const meterSerialNo = _.get(selectedMeter, 'meterNumber', '');
  const readingsDetails = _.get(route, 'params.readingsDetails', {});
  const lastReadingDate = moment(_.get(readingsDetails, 'lastReadingDate', new Date())).format(
    'YYYY-MM-DD',
  ); // TODO AsK for this

  const lastReadingValue = _.get(readingsDetails, 'lastMeterReading', '');

  const onImageSelect = (images) => {
    setReadingPhoto(images[images.length - 1] || {});
    setReadingPhotoError('');
    return images[0];
  };

  const submitReading = async ({ confirmedReading = false }) => {
    if (
      `${readingNumberError}`.length > 0 ||
      `${readingNumber}`.length === 0 ||
      _.get(readingPhoto, 'uri', '').length === 0
    ) {
      if (_.get(readingPhoto, 'uri', '').length === 0) {
        setReadingPhotoError('Please ensure to take a photo of the meter reading as well.');
        return null;
      }
      setReadingNumberError('reading value must be 6 digits long');
      return null;
    }

    setIsSubmitting(true);

    return metersService
      .validateReading({
        readingValue: readingNumber,
        meterObjId: _.get(selectedMeter, 'objId', ''),
      })
      .then(async (response) => {
        if (response.warning && !confirmedReading) {
          flashService.info(response.message);
          openActionSheet();
          return setIsSubmitting(false);
        }
        await metersService.submitReading({
          channelRef,
          readingValue: readingNumber,
          meterNumber: meterSerialNo,
          photo: _.get(readingPhoto, 'uri', ''),
        });
        return setIsSubmitting(false);
      });
  };

  const removeMedia = () => {
    setReadingPhoto({});
  };

  const handleConfirmReading = async () => {
    submitReading({ confirmedReading: true }).then(() => {
      closeActionSheet();
    });
    navigation.goBack();
  };

  const openActionSheet = () => {
    return actionSheetRef.current.setModalVisible(true);
  };

  const closeActionSheet = () => {
    return actionSheetRef.current.setModalVisible(false);
  };

  useEffect(() => {
    dispatch(setImagesSources([]));
  }, []);

  const renderMeterDetails = () => {
    return (
      <>
        <View style={Gutters.smallMargin}>
          <View style={[Layout.alignItemsCenter, Layout.justifyContentCenter]}>
            <Icon
              name="flash"
              type="entypo"
              backgroundColor={Colors.white}
              color={Colors.softBlue}
              size={26}
              containerStyle={[styles.flashIcon, Gutters.regularBMargin]}
            />
            <Text style={[{ color: Colors.softBlue }, Gutters.smallBMargin]}>
              Enter your {meterType} meter reading:
            </Text>
            <Text style={[styles.instruction]}>Meter serial no:{meterSerialNo}</Text>
          </View>

          <TextInput
            labelStyle={Layout.alignItemsCenter}
            placeholder="276212"
            style={[Common.textInput, styles.accountInput]}
            onChangeText={(value) => {
              setReadingNumber(value);
              setReadingNumberError('');
            }}
            maxLength={6}
            value={readingNumber}
            multiline={false}
            error={`${readingNumberError}`.length > 0}
            onEndEditing={() => {
              if (`${readingNumber}`.length !== 6) {
                setReadingNumberError('reading value must be 6 digits long');
              }
            }}
            textAlign="center"
            keyboardType="numeric"
          />
          <HelperText
            type="error"
            style={styles.errorStyle}
            visible={`${readingNumberError}`.length > 0}
          >
            {readingNumberError}
          </HelperText>
          <Text
            style={styles.lastReadingInfo}
          >{`Last reading ${lastReadingValue} on ${lastReadingDate}`}</Text>
        </View>
      </>
    );
  };

  return (
    <>
      <KeyboardAwareScrollView contentContainerStyle={[Gutters.smallPadding]}>
        <Text style={[Gutters.smallMargin, styles.title]}>Submit reading</Text>
        {renderMeterDetails()}
        <ListItem
          topDivider
          bottomDivider
          style={[Gutters.largeVMargin, Gutters.regularHMargin, styles.takePhotoButton]}
        >
          <View style={Layout.row}>
            <Icon
              name="camera"
              color={Colors.softBlue}
              style={styles.photoIcon}
              size={22}
              type="feather"
            />
            <UploadDocumentButton
              title="Take photo of your reading*"
              mode="default"
              color={Colors.black}
              icon={null}
              labelStyle={styles.buttonLabel}
              uppercase={false}
              style={[styles.button, Gutters.largeRPadding]}
              onImageSelect={onImageSelect}
            />
            <Icon name="chevron-right" style={Gutters.tinyTMargin} color={Colors.darkgray} />
          </View>
        </ListItem>
        {`${readingPhotoError}`.length > 0 && (
          <View style={[Layout.row, Gutters.largeHMargin]}>
            <Icon
              name="info"
              color={Colors.danger}
              style={Gutters.tinyRMargin}
              size={17}
              type="feather"
            />
            <Text style={[styles.instruction, styles.photoError]}>{readingPhotoError}</Text>
          </View>
        )}
        {_.get(readingPhoto, 'uri', '').length > 0 && (
          <ImageThumbnail
            key={readingPhoto.uri}
            media={readingPhoto}
            deleteImage={() => {
              removeMedia();
            }}
          />
        )}
        <Button
          mode="contained"
          style={[Layout.fill, Gutters.tinyLMargin, Gutters.largeTMargin]}
          onPress={submitReading}
          loading={isSubmitting}
          disabled={isSubmitting}
          color={Colors.softBlue}
        >
          Submit Reading
        </Button>
      </KeyboardAwareScrollView>
      <ActionSheet ref={actionSheetRef} gestureEnabled>
        <ConfirmReadingActionSheetContent
          loading={isSubmitting}
          onConfirmReading={handleConfirmReading}
          onCancel={() => {
            closeActionSheet();
          }}
        />
      </ActionSheet>
    </>
  );
};

const styles = StyleSheet.create({
  accountInput: {
    marginHorizontal: '15%',
  },
  button: {
    backgroundColor: Colors.transparent,
  },
  buttonLabel: { fontSize: 14, fontWeight: '300' },
  errorStyle: {
    color: Colors.danger,
    marginHorizontal: '12%',
  },
  flashIcon: {
    borderColor: Colors.black,
    borderRadius: 20,
    borderWidth: 1,
  },
  instruction: { fontSize: 12.5, fontWeight: '200', textAlign: 'center' },
  lastReadingInfo: { color: Colors.darkgray, fontSize: 14, textAlign: 'center' },
  photoError: { color: Colors.danger, fontWeight: '400' },
  photoIcon: { marginTop: 8.5 },
  takePhotoButton: { marginTop: '15%' },
  title: { fontSize: 16, fontWeight: '400' },
});

SubmitMeterReadingScreen.propTypes = {
  route: PropTypes.object.isRequired,
};

SubmitMeterReadingScreen.defaultProps = {};

export default SubmitMeterReadingScreen;
