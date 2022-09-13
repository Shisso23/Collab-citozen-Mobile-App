import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { List } from 'react-native-paper';
import { ListItem, Text } from 'react-native-elements';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const CategoriesListView = ({ categories, onCategorySelected, onServiceTypeSelected }) => {
  const { Gutters, Common, Layout, Fonts } = useTheme();
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const handleServiceTypeSelected = (serviceType) => () => {
    setSelectedServiceType(serviceType);
  };

  useEffect(() => {
    if (selectedServiceType) {
      onServiceTypeSelected(selectedServiceType);
    }
  }, [selectedServiceType?.objectId]);

  const onAccordionExpanded = (category) => () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
      onCategorySelected(category);
    }
  };

  const renderServiceTypes = (serviceTypes) => {
    return (
      <View style={styles.viewItemsTypesContainer}>
        {serviceTypes.map((serviceTypeObject) => {
          return (
            <View
              key={`${serviceTypeObject.objectId}`}
              style={[Common.viewWithShadow, Gutters.smallBMargin]}
            >
              <List.Item
                key={`${serviceTypeObject.objectId}`}
                style={Layout.fill}
                title={serviceTypeObject.name}
                titleNumberOfLines={3}
                onPress={handleServiceTypeSelected(serviceTypeObject)}
                titleStyle={Common.cardTitle}
              />
            </View>
          );
        })}
      </View>
    );
  };

  const renderCategoryAccordion = (category) => {
    return (
      <View key={`${category.objId}`}>
        <Text style={[Fonts.textLarge, styles.categoryText]}>{category.channelName}</Text>
        <ListItem.Accordion
          key={`${category.objId}`}
          underlayColor={Colors.transparent}
          style={[Common.viewWithShadow, styles.accordion]}
          content={
            <View style={styles.categoryTextContainer}>
              <Text style={[Fonts.textSmall, styles.categoryText]}>{category.name}</Text>
            </View>
          }
          containerStyle={{ backgroundColor: Colors.transparent }}
          onPress={onAccordionExpanded(category)}
          isExpanded={selectedCategory ? selectedCategory.objId === category.objId : false}
        >
          {renderServiceTypes(category.serviceTypes)}
        </ListItem.Accordion>
      </View>
    );
  };

  return categories.map((category) => renderCategoryAccordion(category));
};

CategoriesListView.propTypes = {
  categories: PropTypes.array.isRequired,
  onCategorySelected: PropTypes.func.isRequired,
  onServiceTypeSelected: PropTypes.func.isRequired,
};

CategoriesListView.defaultProps = {};

const styles = StyleSheet.create({
  accordion: {
    backgroundColor: Colors.lightgray,
    borderRadius: 0,
    marginBottom: 10,
    marginTop: 5,
  },

  categoryText: {
    fontSize: 16,
    fontWeight: '500',
  },

  categoryTextContainer: {
    width: '90%',
  },
});

export default CategoriesListView;
