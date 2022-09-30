import React, { useEffect } from 'react';
import { ScrollView, ImageBackground, Dimensions, StatusBar } from 'react-native';
import { useRoute } from '@react-navigation/native';

import useTheme from '../../../theme/hooks/useTheme';
import OnBackPressHeader from '../../../components/atoms/on-back-press-header/index';
import NewsFeedArticleDetail from '../../../components/common/newsfeed-article/index';

const NewsFeedArticleDetailsScreen = () => {
  const screenHeight = Dimensions.get('window').height;
  const { params } = useRoute();
  const { Images, Layout } = useTheme();

  useEffect(() => {
    StatusBar.setHidden(true);
    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  return (
    <ImageBackground source={Images.serviceRequest} style={Layout.fullSize} resizeMode="cover">
      <OnBackPressHeader arrowColor="#000000" />
      <ScrollView contentContainerStyle={{ paddingBottom: screenHeight - screenHeight * 0.8 }}>
        <NewsFeedArticleDetail NewsFeedArticle={params} />
      </ScrollView>
    </ImageBackground>
  );
};

NewsFeedArticleDetailsScreen.propTypes = {};

NewsFeedArticleDetailsScreen.defaultProps = {};

export default NewsFeedArticleDetailsScreen;
