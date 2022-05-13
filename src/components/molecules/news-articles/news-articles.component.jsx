import React from 'react';
import { RefreshControl, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useFocusEffect } from '@react-navigation/native';
import useTheme from '../../../theme/hooks/useTheme';
import { getNewsFeedAction } from '../../../reducers/news-feed-reducer/news-feed.actions';
import { newsFeedSelector } from '../../../reducers/news-feed-reducer/news-feed.reducer';
import NewsArticle from './news-article.component';

const NewsArticles = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((reducers) => reducers.userReducer);
  const { Gutters, Colors } = useTheme();
  const { newsFeeds, isLoadingNewsFeeds } = useSelector(newsFeedSelector);
  const _loadNewsFeeds = async () => {
    return dispatch(getNewsFeedAction(user.user_id));
  };

  useFocusEffect(
    React.useCallback(() => {
      _loadNewsFeeds();
    }, []),
  );

  return (
    <>
      <FlatList
        contentContainerStyle={Gutters.smallHMargin}
        data={newsFeeds}
        renderItem={({ item, index }) => (
          <NewsArticle item={item} index={index} isLoadingNewsFeeds={isLoadingNewsFeeds} />
        )}
        keyExtractor={(item) => String(item.newsFeedId)}
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
