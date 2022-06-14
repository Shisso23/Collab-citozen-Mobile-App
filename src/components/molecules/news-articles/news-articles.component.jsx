import React, { useState } from 'react';
import { RefreshControl, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

import { useFocusEffect } from '@react-navigation/native';
import useTheme from '../../../theme/hooks/useTheme';
import NewsArticle from './news-article.component';
import newsFeedService from '../../../services/sub-services/news-feed-service/news-feed.service';

const NewsArticles = () => {
  const { user } = useSelector((reducers) => reducers.userReducer);
  const [newsFeeds, setNewsFeeds] = useState([]);
  const { Gutters, Colors } = useTheme();
  const [isLoadingNewsFeeds, setIsLoadingNewsFeeds] = useState(false);

  const _loadNewsFeeds = async () => {
    return newsFeedService.getNewsFeed(user.user_id);
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsLoadingNewsFeeds(true);
      _loadNewsFeeds()
        .then((response) => {
          setNewsFeeds(response);
        })
        .finally(() => {
          setIsLoadingNewsFeeds(false);
        });
    }, []),
  );

  const renderItem = ({ item }) => {
    return <NewsArticle item={item} />;
  };

  const extractListKey = (item) => {
    return String(item.newsFeedId);
  };

  return (
    <>
      <FlatList
        contentContainerStyle={Gutters.smallHMargin}
        data={newsFeeds}
        renderItem={renderItem}
        keyExtractor={extractListKey}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingNewsFeeds}
            onRefresh={_loadNewsFeeds}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      />
    </>
  );
};

export default NewsArticles;
