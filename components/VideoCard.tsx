import { icons } from "@/constants"
import { useGlobalContext } from "@/context/GlobalProvider"
import { removePost, savePost } from "@/lib/APIFunctions"
import { ResizeMode, Video } from "expo-av"
import { useState } from "react"
import { Text, View, Image, Pressable, ViewStyle } from "react-native"

interface CreatorProps {
  name: string
  avatar: string
}

interface VideoProps {
  video: {
    id: number
    title: string
    thumbnail: string
    video: string
    removable: boolean
    creator: CreatorProps
  },
  refeach?: () => void
}

const videoStyle: ViewStyle = {
  width: '100%',
  height: 240,
  borderRadius: 35,
  marginTop: 12,
  overflow: "hidden",
};

const VideoCart = ({ video: {id, title, thumbnail, video, removable=false, creator: {name, avatar}}, refeach = () => {} }: VideoProps) => {
  const [pressed, setPressed] = useState(false)
  const [play, setPlay] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [save, setSave] = useState(false)
  const [remove, setRemove] = useState(false)
  const { user } = useGlobalContext()
  
  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start z-10">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{uri: avatar}}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>
              {name}
            </Text>
          </View>
        </View>
        <View className="pt-2 relative">
          <Pressable
            onPress={() => setDropdown(!dropdown)}
          >
            <Image
              source={icons.menu}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </Pressable>

          {dropdown && (
            <View className="absolute right-0 top-9 bg-black-200 w-32 rounded-lg z-20">
              <Pressable
                className={`flex-row items-center gap-2 pt-3 pb-3 px-5 w-full rounded-t-lg ${save && 'bg-gray-600'} ${!removable && 'rounded-b-lg'}`}
                onPressIn={() => {
                  setSave(true)
                }}
                onPressOut={() => {
                  setSave(false)
                  setDropdown(false)
                }}
                onPress={() => {
                  savePost(id, user.id, user.token)
                }}
                >
                <Image
                  source={icons.bookmark}
                  className="w-3 h-3"
                  resizeMode="contain"
                />
                <Text className="text-gray-100 font-pregular text-sm">Save</Text>
              </Pressable>
              {removable && (
                <Pressable className={`flex-row items-center gap-1 pb-3 pt-1 px-5 w-full rounded-b-lg ${remove && 'bg-gray-600'}`}
                  onPressIn={() => {
                    setRemove(true)
                  }}
                  onPressOut={() => {
                    setRemove(false)
                    setDropdown(false)
                  }}
                  onPress={async () => {
                    await removePost(id, user.token)
                    refeach()
                  }}
                >
                  <Image
                    source={icons.trashcan}
                    className="w-4 h-4"
                    resizeMode="contain"
                  />
                  <Text className="text-gray-100 font-pregular text-sm">Delete</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>

      {play? (
        <Video
        source={{ uri: video }}
        style={videoStyle}
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls
        shouldPlay
        onPlaybackStatusUpdate={(status: any) => {
          if (status.didJustFinish) {
            setPlay(false)
          }
        }}
      />
      ) : (
        <Pressable
          className={`w-full h-60 rounded-xl mt-3 relative justify-center items-center ${pressed ? 'opacity-70': ''}`}
          onPress={() => setPlay(true)}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
        >
          <Image
            source={{uri: thumbnail}}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </Pressable>
      )}
    </View>
  )
}

export default VideoCart