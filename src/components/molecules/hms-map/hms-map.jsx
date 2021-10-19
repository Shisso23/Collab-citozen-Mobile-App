import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  // SafeAreaView,
  TextInput,
  Button,
  View,
  ScrollView,
  Text,
  Switch,
} from 'react-native';
// import HMSMap, { MapTypes } from '@hmscore/react-native-hms-map';
import RNHMSSite from '@hmscore/react-native-hms-site';

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
    const config = {
      apiKey: '<api_key>',
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

  const toggleSwitch = () => {
    setStrictBounds(!strictBounds);
    alert(`StrictBounds: ${!strictBounds}`);
  };

  const onTextSearch = () => {
    const textSearchReq = {
      query,
      location: {
        lat: 48.8815,
        lng: 2.4444,
      },
      radius,
      countryCode: 'FR',
      language: 'fr',
      pageIndex: 1,
      pageSize: 5,
      hwPoiType: RNHMSSite.HwLocationType.RESTAURANT,
      poiType: RNHMSSite.LocationType.GYM,
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

  const onDetailSearch = () => {
    const detailSearchReq = {
      siteId: '2116626084C8358C26700F373E49B9EF',
      language: '',
      children: false,
    };
    RNHMSSite.detailSearch(detailSearchReq)
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

  const onNearbySearch = () => {
    const nearbySearchReq = {
      query,
      location: {
        lat: 48.8815,
        lng: 2.4444,
      },
      radius,
      hwPoiType: RNHMSSite.HwLocationType.RESTAURANT,
      poiType: RNHMSSite.LocationType.GYM,
      language: 'fr',
      pageIndex: 1,
      pageSize: 5,
      strictBounds,
    };
    RNHMSSite.nearbySearch(nearbySearchReq)
      .then((res) => {
        alert(JSON.stringify(res));
        console.log(JSON.stringify(res));
      })
      .catch((err) => {
        alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
      });
  };

  const createWidget = () => {
    const params = {
      searchIntent: {
        apiKey: '<api_key>',
        hint: 'myhint',
      },

      searchFilter: {
        ...defaultLocation,
        query,
        radius,
        language: 'fr',
        countryCode: 'FR',
        poiTypes: [
          RNHMSSite.LocationType.GEOCODE,
          RNHMSSite.LocationType.ADDRESS,
          RNHMSSite.LocationType.ESTABLISHMENT,
          RNHMSSite.LocationType.REGIONS,
          RNHMSSite.LocationType.CITIES,
        ],
        strictBounds,
        children: false,
      },
    };

    RNHMSSite.createWidget(params)
      .then((res) => {
        alert(JSON.stringify(res));
        console.log(JSON.stringify(res));
      })
      .catch((err) => {
        alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
      });
  };

  const enableLogger = () => {
    RNHMSSite.enableLogger()
      .then((res) => {
        alert(JSON.stringify(res));
        console.log(res);
      })
      .catch((err) => {
        alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
      });
  };

  const disableLogger = () => {
    RNHMSSite.disableLogger()
      .then((res) => {
        alert(JSON.stringify(res));
        console.log(res);
      })
      .catch((err) => {
        alert(JSON.stringify(err));
        console.log(JSON.stringify(err));
      });
  };

  // return (
  //   <SafeAreaView>
  //     <HMSMap
  //       style={styles.fullHeight}
  //       mapType={MapTypes.NORMAL}
  //       camera={{
  //         target: {
  //           latitude: 41.02155220194891,
  //           longitude: 29.0037998967586,
  //         },
  //         zoom: 12,
  //       }}
  //     />
  //   </SafeAreaView>
  // );
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
        <View style={[styles.switchContainer]}>
          <Text>Strict Bounds</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={strictBounds ? '#f5dd4b' : '#f4f3f4'}
            onValueChange={toggleSwitch}
            value={strictBounds}
          />
        </View>
      </View>
      <View>
        <Button title="Text Search" onPress={onTextSearch} />
      </View>

      <View style={styles.btnContainer}>
        <Button title="Detail Search" onPress={onDetailSearch} />
      </View>

      <View style={styles.btnContainer}>
        <Button title="Query Suggestion" onPress={onQuerySuggestion} />
      </View>

      <View style={styles.btnContainer}>
        <Button title="Query AutoComplete" onPress={onQueryAutocomplete} />
      </View>

      <View style={styles.btnContainer}>
        <Button title="Nearby Search" onPress={onNearbySearch} />
      </View>

      <View style={styles.btnContainer}>
        <Button title="Create Widget" onPress={createWidget} />
      </View>

      <View style={styles.btnContainer}>
        <Button title="Enable the logger" onPress={enableLogger} />
      </View>

      <View style={styles.btnContainer}>
        <Button title="Disable the logger" onPress={disableLogger} />
      </View>
    </ScrollView>
  );
};

export default BasicMap;

const styles = StyleSheet.create({
  // fullHeight: { height: '100%' },
});
