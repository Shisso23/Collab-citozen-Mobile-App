import React, { useEffect, useState } from 'react';
import { RefreshControl, FlatList, View, Text } from 'react-native';
import { useSelector } from 'react-redux';

import { useFocusEffect } from '@react-navigation/native';
import { PlaceholderLine, PlaceholderMedia, Placeholder, Fade } from 'rn-placeholder';
import useTheme from '../../../theme/hooks/useTheme';
import NewsArticle from './news-article.component';
import newsFeedService from '../../../services/sub-services/news-feed-service/news-feed.service';
import { Colors } from '../../../theme/Variables';
import Layout from '../../../theme/Layout';
import Fonts from '../../../theme/Fonts';

const NewsArticlesList = () => {
  const { user } = useSelector((reducers) => reducers.userReducer);
  const [newsFeeds, setNewsFeeds] = useState([]);
  const { Gutters, Common } = useTheme();
  const [isLoadingNewsFeeds, setIsLoadingNewsFeeds] = useState(true);
  const [alreadyFetchedOnce, setAlreadyFetchedOnce] = useState(false);

  const _loadNewsFeeds = async () => {
    return newsFeedService.getNewsFeed(user.user_id);
  };

  useEffect(() => {
    setIsLoadingNewsFeeds(true);
    _loadNewsFeeds()
      .then((response) => {
        setNewsFeeds(response);
      })
      .finally(() => {
        setIsLoadingNewsFeeds(false);
        setAlreadyFetchedOnce(true);
      });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (alreadyFetchedOnce && !isLoadingNewsFeeds) {
        _loadNewsFeeds().then((response) => {
          setNewsFeeds(response);
        });
      }
    }, [alreadyFetchedOnce]),
  );

  const renderPlaceHolders = () => {
    const dummyArray = [1, 2, 3, 4, 5, 6, 7];
    return (
      <View>
        {isLoadingNewsFeeds ? (
          dummyArray.map((i) => {
            return (
              <View
                key={`${i}`}
                style={[
                  Common.textInputWithShadow,
                  Gutters.tinyMargin,
                  Gutters.smallVMargin,
                  ...[{ height: 120 }],
                ]}
              >
                <Placeholder Animation={Fade} Left={PlaceholderMedia} Right={PlaceholderMedia}>
                  <PlaceholderLine width={80} />
                  <PlaceholderLine />
                  <PlaceholderLine width={30} />
                </Placeholder>
              </View>
            );
          })
        ) : (
          <Text style={Fonts.titleRegular}>
            There are no news feed yet. Please subscribe to a channel to receive news feeds
          </Text>
        )}
      </View>
    );
  };

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
        ListEmptyComponent={renderPlaceHolders()}
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

export default NewsArticlesList;
