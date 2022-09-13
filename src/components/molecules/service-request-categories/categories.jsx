import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Text } from 'react-native-elements';

import useTheme from '../../../theme/hooks/useTheme';
import { setImagesSources } from '../../../reducers/service-request-reducer/service-request.actions';
import { Colors } from '../../../theme/Variables';
import CategoryTile from '../../atoms/service-request-category-tile/category-tile';

const Categories = ({ categories, onCategoryPress, onViewAllPress }) => {
  const dispatch = useDispatch();
  const { Gutters, Common, Layout } = useTheme();

  useEffect(() => {
    dispatch(setImagesSources([]));
  }, []);

  const onPressCategory = (category) => () => {
    onCategoryPress(category);
  };

  const renderCategories = () => {
    return (
      <View style={[Layout.row, styles.categoriesContainer]}>
        {categories
          .filter((category) => category.favorite === true)
          .map((category) => (
            <CategoryTile
              key={`${category.objId}`}
              categoryObject={category}
              onPress={onPressCategory(category)}
              size={36}
            />
          ))}
      </View>
    );
  };

  const renderViewMoreButton = () => {
    return (
      <TouchableOpacity
        onPress={onViewAllPress}
        style={[
          Common.viewWithShadow,
          Layout.colCenter,
          styles.viewAllButton,
          Gutters.regularVMargin,
        ]}
      >
        <Text style={[Common.textPrimary, styles.viewAllText]}>View all Categories</Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      style={[Common.defaultBackGround]}
      extraHeight={150}
      enableOnAndroid
    >
      {renderCategories()}
      {renderViewMoreButton()}
    </KeyboardAwareScrollView>
  );
};

Categories.propTypes = {
  categories: PropTypes.array.isRequired,
  onCategoryPress: PropTypes.func.isRequired,
  onViewAllPress: PropTypes.func.isRequired,
};

Categories.defaultProps = {};

const styles = StyleSheet.create({
  categoriesContainer: {
    flexWrap: 'wrap',
  },
  viewAllButton: {
    backgroundColor: Colors.transparent,
    borderColor: Colors.primary,
    borderRadius: 10,
    borderWidth: 2,
    elevation: 0,
    height: 45,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
});

export default Categories;
