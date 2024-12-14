import { useEffect, useState } from 'react'
import { FlatList, RefreshControl, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import SearchInput from '@/components/SearchInput'
import EmptyState from '@/components/EmptyState'
import useFetchData from '@/lib/UseAPI'
import VideoCart from '@/components/VideoCard'
import { useLocalSearchParams } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import { searchPosts } from '@/lib/APIFunctions'

const Search = () => {
  const { user } = useGlobalContext();
  const { query } = useLocalSearchParams()
  const {data: posts, refetch, isLoading} = useFetchData(() => searchPosts(query as string, user.token))

  const [refreshing, setRefreshing] = useState(false)
  
  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }
  
  useEffect(() => {
    refetch()
  }, [query])

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#161622'}}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <VideoCart video={item as any} />
        )}
        ListHeaderComponent={() => {
          return (
            <View className='my-6 px-4'>
              <Text className='font-pmedium text-sm text-gray-100'>
                Search Results
              </Text>
              <Text className='text-2xl font-psemibold text-white'>
                {query}
              </Text>

              <View className='mt-6 mb-8'>
                <SearchInput initialQuery={query} />
              </View>              
            </View>
          )
        }}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
       />
    </SafeAreaView>
  )
}


export default Search