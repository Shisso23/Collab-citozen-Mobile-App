import React from 'react';
import { ScrollView, ImageBackground } from 'react-native';
import { useRoute } from '@react-navigation/native';

import useTheme from '../../../theme/hooks/useTheme';
import OnBackPressHeader from '../../../components/atoms/on-back-press-header/index';
import NewsFeedArticle from '../../../components/common/newsfeed-article/index';

const ViewNewsFeedArticleScreen = () => {
  const { params } = useRoute();
  const { Images, Layout } = useTheme();

  return (
    <ImageBackground source={Images.serviceRequest} style={[Layout.fullSize]} resizeMode="cover">
      <OnBackPressHeader arrowColor="#000000" />
      <ScrollView>
        <NewsFeedArticle NewsFeedArticle={params} />
      </ScrollView>
    </ImageBackground>
  );
};

ViewNewsFeedArticleScreen.propTypes = {};

ViewNewsFeedArticleScreen.defaultProps = {};

export default ViewNewsFeedArticleScreen;
