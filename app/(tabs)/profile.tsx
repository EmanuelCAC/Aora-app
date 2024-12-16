import { useState } from 'react'
import { Alert, FlatList, Image, Pressable, RefreshControl, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { icons } from '@/constants'
import EmptyState from '@/components/EmptyState'
import useFetchData from '@/lib/UseAPI'
import VideoCart from '@/components/VideoCard'
import InfoBox from '@/components/InfoBox'
import { router } from 'expo-router'
import * as DocumentPicker from 'expo-document-picker'

import { useGlobalContext } from '../../context/GlobalProvider'
import { TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUserPosts } from '@/lib/APIFunctions'
import axios from 'axios'

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, refetch } = useFetchData(() => getUserPosts(user.token, user.id))

  const [refreshing, setRefreshing] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [save, setSave] = useState(false)
  const [remove, setRemove] = useState(false)

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

  const changeProfilePic = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/png', 'image/jpg', 'image/jpeg']
    })
    
    if(!result.canceled) {
      console.log(result.assets[0])

      const formData = new FormData()

      const imageData = {
        name: result.assets[0].name,
        uri: result.assets[0].uri,
        type: result.assets[0].mimeType,
        size: result.assets[0].size
      }
      formData.append('image', imageData as any)
      formData.append('userId', user.id)

      const { data } = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/users/edit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${user.token}`
          }
        }
      )

      user.avatar = data.avatar
      setUser({avatar: data.avatar, ...user})
      await AsyncStorage.setItem("currentUser", JSON.stringify(user))
      await refetch()
    }
  }

  const removeProfilePic = async () => {
    const formData = new FormData()
    formData.append('userId', user.id)

    const { data } = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/users/edit`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${user.token}`
        }
      }
    )

    user.avatar = data.avatar
    setUser({avatar: data.avatar, ...user})
    await AsyncStorage.setItem("currentUser", JSON.stringify(user))
    await refetch()
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#161622', position: 'relative'}}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <VideoCart video={{removable: true, ...item} as any} refeach={() => {refetch()}}/>
        )}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <View className='w-full items-end mb-10'>
            <TouchableOpacity
              onPress={logout}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>
            </View>

            <Pressable className="w-16 h-16 border border-secondary rounded-lg justify-center items-center"
              onPress={() => setShowOptions(!showOptions)}
            >
              <Image
                source={{uri: user?.avatar}}
                className="w-[100%] h-[100%] rounded-[0.42rem]"
                resizeMode='cover'
              />
            </Pressable>

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
      {showOptions && (
        <View className='w-full bg-black-200'>
          <Pressable
            className={`flex-row items-center gap-2 pt-3 pb-3 px-5 w-full rounded-t-lg ${save && 'bg-gray-600'}`}
            onPressIn={() => {
              setSave(true)
            }}
            onPressOut={() => {
              setSave(false)
              setShowOptions(false)
            }}
            onPress={() => changeProfilePic()}
            >
            <Image
              source={icons.bookmark}
              className="w-4 h-4"
              resizeMode="contain"
            />
            <Text className="text-gray-100 font-pmedium text-lg">Select Photo</Text>
          </Pressable>
            <Pressable className={`flex-row gap-1 pb-3 pt-1 px-5 w-full rounded-b-lg ${remove && 'bg-gray-600'}`}
              onPressIn={() => {
                setRemove(true)
              }}
              onPressOut={() => {
                setRemove(false)
                setShowOptions(false)
              }}
              onPress={() => removeProfilePic()}
            >
              <Image
                source={icons.trashcan}
                className="w-5 h-5 -ml-0.5"
                resizeMode="contain"
              />
              <Text className="text-gray-100 font-pmedium text-lg">Remove Photo</Text>
            </Pressable>
        </View>
      )}
    </SafeAreaView>
  )
}


export default Profile