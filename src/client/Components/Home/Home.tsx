import React from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../store'
import { IObjectOfUsers } from './index'
import { mapUserById } from './helperfunctions'
import {
  checkIfDataExists,
  IGroupedArraysAndObjects
} from '../utilityfunctions'
import FavoriteChats from './FavoriteChats'
import MyLanguages from './MyLanguages'

interface IReduxStateProps {
  usersMap: IObjectOfUsers
}

interface IHomeProps extends IReduxStateProps {}

const Home: React.FC<IHomeProps> = ({ usersMap }) => {
  return (
    <div>
      <FavoriteChats {...{ usersMap }} />
      <MyLanguages {...{ usersMap }} />
    </div>
  )
}

const mapStateToProps = ({
  users,
  userLanguages,
  auth,
  chatGroups,
  userChatGroups
}: ReduxState): IReduxStateProps => {
  const dataExistsInput: IGroupedArraysAndObjects = {
    objects: [auth.user],
    arrays: [users, userLanguages, chatGroups, userChatGroups]
  }
  const dataExists: boolean = checkIfDataExists(dataExistsInput)
  return { usersMap: dataExists ? mapUserById(users) : {} }
}

export default connect(mapStateToProps)(Home)
