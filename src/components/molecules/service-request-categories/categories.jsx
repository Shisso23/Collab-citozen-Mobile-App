import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from 'react-native-elements';

import useTheme from '../../../theme/hooks/useTheme';
import CategoryTile from '../../atoms/service-request-category-tile/category-tile';

const Categories = ({ municipalities, onCategoryPress, setSelectedChanne }) => {
  const screenHeight = Dimensions.get('window').height;
  const VIEWMORETILESDATA = {
    name: 'View More',
    id: 0,
    iconName: 'more-horizontal',
    iconSet: 'feather',
    favourite: true,
    serviceTypes: [],
  };
  const { Gutters, Layout, Fonts } = useTheme();
  const [favoriteCategoriesData, setFavoriteCategoriesData] = useState([]);
  const [showMoreTiles, setShowMoreTiles] = useState(false);
  const [viewMoreTilesData, setViewMoreTilesData] = useState(VIEWMORETILESDATA);

  useEffect(() => {
    setFavoriteCategoriesData(
      municipalities.map((municipality) => ({
        ...municipality,
        categories: municipality.categories.filter((category) => category.favourite === true),
      })),
    );
  }, []);

  const onPressCategory = (category, channel) => () => {
    onCategoryPress(category);
    setSelectedChanne(channel);
  };

  const onViewMorePress = () => {
    if (showMoreTiles) {
      setShowMoreTiles(false);
      setViewMoreTilesData({ ...viewMoreTilesData, name: 'View More' });
      setFavoriteCategoriesData(
        municipalities.map((municipality) => ({
          ...municipality,
          categories: municipality.categories.filter((category) => category.favourite === true),
        })),
      );
    } else {
      setFavoriteCategoriesData(municipalities);
      setShowMoreTiles(true);
      setViewMoreTilesData({ ...viewMoreTilesData, name: 'View Less' });
    }
  };

  const isShowMoreTileVisible = () => {
    const allCategories = [];
    const favoriteCategories = [];
    municipalities.forEach((municipality) => {
      allCategories.push(...municipality.categories);
    });

    favoriteCategoriesData.forEach((municipality) => {
      favoriteCategories.push(...municipality.categories);
    });
    return allCategories.length > favoriteCategories.length;
  };

  const renderCategories = () => {
    return (
      <View style={{ paddingBottom: screenHeight - screenHeight * 0.8 }}>
        {favoriteCategoriesData.map((municipality, index) => {
          return (
            <View key={municipality.id}>
              <Text style={[Fonts.textLarge, Gutters.tinyBMargin]}>{municipality.name}</Text>
              <View style={[Layout.row, styles.categoriesContainer, Layout.justifyContentCenter]}>
                {municipality.categories.map((category) => (
                  <CategoryTile
                    key={`${category.id}`}
                    categoryObject={category}
                    onPress={onPressCategory(category, municipality)}
                    size={36}
                  />
                ))}
                {index === favoriteCategoriesData.length - 1 && isShowMoreTileVisible() && (
                  <CategoryTile
                    categoryObject={viewMoreTilesData}
                    onPress={onViewMorePress}
                    size={36}
                  />
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return <>{renderCategories()}</>;
};

Categories.propTypes = {
  municipalities: PropTypes.array.isRequired,
  onCategoryPress: PropTypes.func.isRequired,
  setSelectedChanne: PropTypes.func.isRequired,
};

Categories.defaultProps = {};

const styles = StyleSheet.create({
  categoriesContainer: {
    flexWrap: 'wrap',
  },
});

export default Categories;
