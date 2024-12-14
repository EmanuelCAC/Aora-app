import { useState } from 'react'
import { Alert, FlatList, Image, RefreshControl, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { icons } from '@/constants'
import EmptyState from '@/components/EmptyState'
import useFetchData from '@/lib/UseAPI'
import VideoCart from '@/components/VideoCard'
import InfoBox from '@/components/InfoBox'
import { router } from 'expo-router'

import { useGlobalContext } from '../../context/GlobalProvider'
import { TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUserPosts } from '@/lib/APIFunctions'

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, refetch } = useFetchData(() => getUserPosts(user.token, user.id))

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const logout = async () => {
    try {
      setUser(null)
      setIsLoggedIn(false)
      router.replace('/sign-in')

      await AsyncStorage.clear()
    } catch (error: any) {
      Alert.alert("Error", error.message)
    } 
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#161622'}}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <VideoCart video={{removable: true, ...item} as any} refeach={() => {refetch()}}/>
        )}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              style={{width: '100%', alignItems: 'flex-end', marginBottom: '40px'} as any}
              onPress={logout}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
              <Image
                source={{uri: user?.avatar}}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode='cover'
              />
            </View>

            <InfoBox
              title={user?.name}
              subtitle={user?.email}
              containerStyles='mt-5'
              titleStyles="text-lg"
            />

              
            <View className="mt-5 flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles='mr-10'
                titleStyles="text-xl"
              />

              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )
        }
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


export default Profile