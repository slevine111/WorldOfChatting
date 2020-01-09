import React from 'react'
import FavoriteChats from './FavoriteChats'
import MyLanguages from './MyLanguages'

const Home: React.FC<{}> = () => {
  return (
    <div>
      <FavoriteChats />
      <MyLanguages />
    </div>
  )
}

export default Home
