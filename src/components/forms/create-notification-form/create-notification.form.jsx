import React from 'react';
import { ViewPropTypes, View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, HelperText } from 'react-native-paper';
import { Input } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import { getFormError } from '../form-utils';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import { CheckBoxTick } from '../../atoms';

const CreateNotificationForm = ({
  submitForm,
  onSuccess,
  containerStyle,
  initialValues,
  interestTypes,
}) => {
  const { Gutters, Common, Layout, Fonts } = useTheme();
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is a required field'),
    interestTypes: Yup.array().min(1, 'At least one interest type needs to be selected').required(),
    description: Yup.string().required('Description is a required field'),
  });

  const _handleFormSubmitError = (error, actions) => {
    actions.setSubmitting(false);
  };

  const _handleSubmission = (formData, actions) => {
    submitForm(formData)
      .then(() => {
        actions.setSubmitting(false);
        onSuccess();
      })
      .catch((error) => _handleFormSubmitError(error, actions, formData));
  };

  const onInterestTypeSelect = (checkBoxItem, setFieldValue, values) => {
    if (
      values.interestTypes?.every((interestType) => {
        return interestType.obj_id !== checkBoxItem.selectedItem.obj_id && checkBoxItem.present;
      })
    ) {
      setFieldValue('interestTypes', [...values.interestTypes, checkBoxItem.selectedItem]);
    } else if (
      values.interestTypes?.some(
        (interestType) =>
          interestType.obj_id === checkBoxItem.selectedItem.obj_id && !checkBoxItem.present,
      )
    ) {
      setFieldValue(
        'interestTypes',
        values.interestTypes?.filter(
          (interestType) => interestType.obj_id !== checkBoxItem.selectedItem.obj_id,
        ),
      );
    }
  };

  const renderServiceTypes = ({ item }, setFieldValue, values) => {
    return (
      <View style={[Layout.row, Layout.alignItemsCenter, Common.registerTextInputWithShadow]}>
        <CheckBoxTick
          selectedItem={item}
          checkedIcon="check-circle"
          uncheckedIcon="circle-o"
          hitSlop={{ right: 200 }}
          setItem={(checkBoxItem) => {
            onInterestTypeSelect(checkBoxItem, setFieldValue, values);
          }}
          checkedColor={Colors.primary}
          size={30}
        />
        <Text>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style={containerStyle}>
      <Formik
        initialValues={initialValues}
        initialStatus={{ apiErrors: {} }}
        onSubmit={_handleSubmission}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          isSubmitting,
          handleBlur,
          setFieldValue,
          touched,
          status,
        }) => {
          const error = (name) => getFormError(name, { touched, status, errors });
          return (
            <>
              <Text style={[Fonts.titleRegular, Gutters.regularVMargin]}>Create Notification</Text>
              <Text
                style={[styles.placeHolder, Gutters.smallVMargin, Common.title, Fonts.textRegular]}
              >
                Title
              </Text>
              <Input
                value={values.title}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                containerStyle={[
                  styles.inputContainer,
                  ...[{ height: 40 }],
                  Common.defaultBackGround,
                ]}
                inputContainerStyle={[...[{ borderBottomWidth: 0 }]]}
                inputStyle={[Gutters.tinyLPadding]}
                autoCapitalize="none"
              />
              <HelperText
                style={[Common.errorStyle, ...[{ paddingLeft: 0 }]]}
                type="error"
                visible={error('title')}
              >
                {error('title')}
              </HelperText>
              <Text style={[styles.placeHolder, Gutters.smallBMargin, Fonts.textRegular]}>
                Select Interest Types
              </Text>

              <FlatList
                keyExtractor={(item) => `${item.obj_id}`}
                data={interestTypes}
                renderItem={(itemData) => renderServiceTypes(itemData, setFieldValue, values)}
              />
              <HelperText
                style={[Common.errorStyle, ...[{ paddingLeft: 0 }]]}
                type="error"
                visible={error('interestTypes')}
              >
                {error('interestTypes')}
              </HelperText>
              <Text style={[styles.placeHolder, Gutters.smallVMargin, Fonts.textRegular]}>
                Descrption
              </Text>
              <Input
                value={values.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                leftIconContainerStyle={[Gutters.regularHMargin]}
                inputStyle={[Gutters.tinyLPadding, Layout.fullHeight]}
                multiline
                containerStyle={[
                  styles.inputContainer,
                  Common.defaultBackGround,
                  Common.largelHMargin,
                  ...[{ height: 90, borderColor: Colors.gray }],
                ]}
                inputContainerStyle={[...[{ borderBottomWidth: 0 }], Layout.fullHeight]}
                autoCapitalize="none"
              />
              <HelperText
                style={[Common.errorStyle, ...[{ paddingLeft: 0 }]]}
                type="error"
                visible={error('description')}
              >
                {error('description')}
              </HelperText>
              <View style={[Layout.center]}>
                <Button
                  style={[Layout.halfWidth, Gutters.regularVMargin]}
                  contentStyle={[styles.submitButton]}
                  labelStyle={[...[{ color: Colors.white }]]}
                  mode="contained"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  color={Colors.white}
                >
                  Submit
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

CreateNotificationForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  interestTypes: PropTypes.array.isRequired,
};

CreateNotificationForm.defaultProps = {
  onSuccess: () => null,
  containerStyle: {},
};
const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 0.5,
    borderColor: Colors.gray,
    borderRadius: 5,
    borderWidth: 0.5,
  },
  placeHolder: {
    color: Colors.darkgray,
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
});
export default CreateNotificationForm;
