import { useState } from 'react'
import { FlatList, Image, RefreshControl, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '@/constants'
import SearchInput from '@/components/SearchInput'
import EmptyState from '@/components/EmptyState'
import useFetchData from '@/lib/UseAPI'
import { useGlobalContext } from '@/context/GlobalProvider'
import { getSavedPosts } from '@/lib/APIFunctions'
import SavedVideoCart from '@/components/SavedVideoCard'

const BookMark = () => {
  const { user } = useGlobalContext();

  const {data: posts, refetch} = useFetchData(() => getSavedPosts(user.id, user.token))

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  } 

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#161622'}}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SavedVideoCart video={item.video as any} id={item.id} refeach={() => refetch()} />
        )}
        ListHeaderComponent={() => {
          return (
            <View className='my-6 px-4 space-y-6'>
              <View className='justify-between items-start flex-row mb-6'>
                <View> 
                  <Text className='text-2xl font-psemibold text-white'>
                    Saved Videos
                  </Text>
                </View>

                <View className='mt-1.5'>
                  <Image
                    source={images.logoSmall}
                    className='w-9 h-10'
                    resizeMode='contain'
                  />
                </View>
              </View>

              <SearchInput />
            </View>
          )
        }}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
       />
    </SafeAreaView>
  )
}


export default BookMark