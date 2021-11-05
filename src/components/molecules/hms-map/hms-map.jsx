import React, { useState, useMemo } from 'react';
import { StyleSheet, TextInput, Button, View, ScrollView } from 'react-native';
import RNHMSSite from '@hmscore/react-native-hms-site';
import ax from 'axios';
import _ from 'lodash';
import appConfig from '../../../config';

const axiosService = ax.create({
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'content-type': 'application/json',
  },
  responseType: 'json',
});

const apiKey = encodeURIComponent(appConfig.huaweiApiKey);

const BasicMap = () => {
  const [query, setQuery] = useState('France');
  const [radius, setRadius] = useState(100);
  const defaultLocation = {
    query,
    location: {
      lat: -25.73134,
      lng: 28.21837,
    },
    bounds: {
      northeast: {
        lat: 49,
        lng: 2.47,
      },
      southwest: {
        lat: -24.73134,
        lng: 28.0,
      },
    },
    poiTypes: [RNHMSSite.LocationType.GEOCODE, RNHMSSite.LocationType.ADDRESS],
  };

  const apiSearch = (action, keyword) => {
    axiosService
      .post(`${appConfig.hmsSiteApiUrl}/${action}?key=${apiKey}`, {
        ...defaultLocation,
        query: keyword,
      })
      .then((results) => {
        console.log({ results });
      })
      .catch((error) => console.log({ error }));
  };

  const debounce = useMemo(() => _.throttle(apiSearch, 1000, false), []);

  const setStateByKey = (key, data) => {
    switch (key) {
      case 'query':
        setQuery(data);
        break;
      case 'radius':
        setRadius(data);
        break;
      default:
        break;
    }
  };
  const changeInputValue = (key, data) => {
    data = data.length < 1 ? '' : data;
    setStateByKey(key, data);
  };

  const changeRadiusValue = (data) => {
    data = data.replace(/[^0-9]/g, '');
    data = data === '' ? data : Number(data);

    setRadius(data);
  };

  return (
    <ScrollView>
      <View style={[styles.container]}>
        <TextInput
          value={query}
          style={[styles.input, styles.width35]}
          placeholder="query"
          onChangeText={(e) => {
            debounce('queryAutoComplete', e);
            changeInputValue('query', e);
          }}
        />
        <TextInput
          value={radius ? radius.toString() : null}
          keyboardType="number-pad"
          maxLength={5}
          style={[styles.input, styles.width35]}
          placeholder="radius"
          onChangeText={(e) => changeRadiusValue(e)}
        />
      </View>

      <Button title="Query Suggestion" onPress={() => apiSearch('querySuggestion', query)} />

      <Button title="Query AutoComplete" onPress={() => apiSearch('queryAutoComplete', query)} />
    </ScrollView>
  );
};

export default BasicMap;

const styles = StyleSheet.create({
  // fullHeight: { height: '100%' },
});
