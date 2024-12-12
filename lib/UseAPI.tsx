import { useState, useEffect } from "react"
import axios from "axios"
import { Alert } from "react-native"

// Defina a interface para o tipo de dados
interface Creator {
  username: string
  avatar: string
}

interface DataItem {
  id: number
  title: string
  thumbnail: string
  video: string
  creator: Creator
}

const useFetchData = (fn: any) => {
  const [data, setData] = useState<DataItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchdata = async () => {
    setIsLoading(true)

    try {
      const data = await fn()
      setData(data)
    } catch (error: any) {
      Alert.alert("Error", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchdata()
  }, [])

  const refetch = () => fetchdata()

  
  return { data, isLoading, refetch }
}

export default useFetchData
