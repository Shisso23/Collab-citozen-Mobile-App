/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/prop-types */
/* eslint-disable react-native/no-color-literals */
import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import { Button } from './button';
import styles from './styles';

export const Tooltip = ({
  isFirstStep,
  isLastStep,
  handleNext,
  handlePrev,
  handleStop,
  currentStep,
  labels,
}) => (
  <View
    style={{
      borderRadius: 16,
      paddingTop: 24,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 16,
      width: '80%',
      backgroundColor: '#ffffffef',
    }}
  >
    <ScrollView contentContainerStyle={styles.tooltipContainer}>
      <Text testID="stepDescription" style={styles.tooltipText}>
        {currentStep && currentStep.text}
      </Text>
    </ScrollView>
    <View style={[styles.bottomBar]}>
      {!isLastStep ? (
        <TouchableOpacity onPress={handleStop}>
          <Button>{labels?.skip || 'Skip'}</Button>
        </TouchableOpacity>
      ) : null}
      {!isFirstStep ? (
        <TouchableOpacity onPress={handlePrev}>
          <Button>{labels?.previous || 'Previous'}</Button>
        </TouchableOpacity>
      ) : null}
      {!isLastStep ? (
        <TouchableOpacity onPress={handleNext}>
          <Button>{labels?.next || 'Next'}</Button>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleStop}>
          <Button>{labels?.finish || 'Finish'}</Button>
        </TouchableOpacity>
      )}
    </View>
  </View>
);
