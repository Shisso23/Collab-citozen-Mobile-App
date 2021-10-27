import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Button, View, ScrollView } from 'react-native';
import RNHMSSite from '@hmscore/react-native-hms-site';
import appConfig from '../../../config';

const defaultLocation = {
  location: {
    lat: 48.8815,
    lng: 2.4444,
  },
  bounds: {
    northeast: {
      lat: 49,
      lng: 2.47,
    },
    southwest: {
      lat: 47.8815,
      lng: 2.0,
    },
  },
};

const BasicMap = () => {
  const [strictBounds, setStrictBounds] = useState(false);
  const [query, setQuery] = useState('France');
  const [radius, setRadius] = useState(1000);

  useEffect(() => {
    console.log({ key: appConfig.mapKitKey });
    console.log({ encoded: encodeURIComponent(appConfig.mapKitKey) });
    const config = {
      apiKey: encodeURIComponent(appConfig.mapKitKey),
    };

    RNHMSSite.initializeService(config)
      .then(() => {
        console.log('Service is initialized successfully');
      })
      .catch((err) => {
        console.log(`Error : ${err}`);
      });
  }, []);

  const setStateByKey = (key, data) => {
    switch (key) {
      case 'query':
        setQuery(data);
        break;
      case 'strictBounds':
        setStrictBounds(data);
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

  const onTextSearch = () => {
    const textSearchReq = {
      query,
      location: {
        lat: 48.8815,
        lng: 2.4444,
      },
      radius,
      countryCode: 'za',
      language: 'fr',
      pageIndex: 1,
      pageSize: 5,
      // hwPoiType: RNHMSSite.HwLocationType.RESTAURANT,
      // poiType: RNHMSSite.LocationType.GYM,
      children: true,
    };
    RNHMSSite.textSearch(textSearchReq)
      .then((res) => {
        alert(JSON.stringify(res));
        console.log(JSON.stringify(res));
      })
      .catch((err) => {
        alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
      });
  };

  const onQuerySuggestion = () => {
    const querySuggestionReq = {
      ...defaultLocation,
      query,
      radius,
      countryCode: 'FR',
      language: 'fr',
      poiTypes: [
        RNHMSSite.LocationType.GEOCODE,
        RNHMSSite.LocationType.ADDRESS,
        RNHMSSite.LocationType.ESTABLISHMENT,
        RNHMSSite.LocationType.REGIONS,
        RNHMSSite.LocationType.CITIES,
      ],
      strictBounds,
      children: false,
    };
    RNHMSSite.querySuggestion(querySuggestionReq)
      .then((res) => {
        alert(JSON.stringify(res));
      })
      .catch((err) => {
        alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
      });
  };

  const onQueryAutocomplete = () => {
    const queryAutocompleteReq = {
      query,
      location: {
        lat: 48.8815,
        lng: 2.4444,
      },
      radius,
      language: 'fr',
      children: false,
    };
    RNHMSSite.queryAutocomplete(queryAutocompleteReq)
      .then((res) => {
        console.log({ res });
        alert(JSON.stringify(res));
        console.log(JSON.stringify(res));
      })
      .catch((err) => {
        console.log({ err });
        alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
      });
  };

  return (
    <ScrollView>
      <View style={[styles.container]}>
        <TextInput
          value={query}
          style={[styles.input, styles.width35]}
          placeholder="query"
          onChangeText={(e) => changeInputValue('query', e)}
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
      <View>
        <Button title="Text Search" onPress={onTextSearch} />
      </View>

      <View style={styles.btnContainer}>
        <Button title="Query Suggestion" onPress={onQuerySuggestion} />
      </View>

      <View style={styles.btnContainer}>
        <Button title="Query AutoComplete" onPress={onQueryAutocomplete} />
      </View>
    </ScrollView>
  );
};

export default BasicMap;

const styles = StyleSheet.create({
  // fullHeight: { height: '100%' },
});
