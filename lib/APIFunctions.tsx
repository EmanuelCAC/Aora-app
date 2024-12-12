import axios from "axios";


export const getAllPosts = async (token: string) => {
  try {
    const { data } = await axios.get(process.env.EXPO_PUBLIC_API_URL + '/videos/all', {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
  
    return data
  } catch (error) {
    throw error
  }
}

export const getLatestPosts = async (token: string) => {
  try {
    const { data } = await axios.get(process.env.EXPO_PUBLIC_API_URL + '/videos/latest', {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
  
    return data
  } catch (error) {
    throw error
  }
}

export const getUserPosts = async (token: string, id: number) => {
  try {
    const { data } = await axios.get(process.env.EXPO_PUBLIC_API_URL + '/videos/all/' + id, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
   
    return data
  } catch (error) {
    throw error
  }
}

export const searchPosts = async (query: string, token: string) => {
  try {
    const { data } = await axios.post(process.env.EXPO_PUBLIC_API_URL + '/videos/search',
      { query },
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    )

    return data
  } catch (error) {
    throw error
  }
}