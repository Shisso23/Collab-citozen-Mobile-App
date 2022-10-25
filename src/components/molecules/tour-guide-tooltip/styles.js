/* eslint-disable react-native/no-color-literals */
import { StyleSheet } from 'react-native';

export const Z_INDEX = 100;
export const MARGIN = 13;
export const OFFSET_WIDTH = 4;

export default StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    padding: 10,
  },
  buttonText: {
    color: '#27ae60',
  },
  container: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: Z_INDEX,
  },
  nonInteractionPlaceholder: {
    backgroundColor: 'transparent',
    zIndex: Z_INDEX - 2,
  },
  overlayContainer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  tooltip: {
    alignItems: 'center',
    borderRadius: 16,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingBottom: 16,
    paddingHorizontal: 15,
    paddingTop: 24,
    position: 'absolute',
    width: '100%',
    zIndex: Z_INDEX - 1,
  },
  tooltipContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    overflow: 'scroll',
    width: '80%',
  },
  tooltipText: {
    lineHeight: 21,
    textAlign: 'auto',
  },
});
