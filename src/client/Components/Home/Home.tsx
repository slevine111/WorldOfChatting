import React from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../store'
import { ILanguageObjects, IObjectOfUsers } from './index'
import { groupUsersByLanguage, mapUserById } from './helperfunctions'
import {
  checkIfDataExists,
  IGroupedArraysAndObjects
} from '../utilityfunctions'
import FavoriteChats from './FavoriteChats'

interface IReduxStateProps extends ILanguageObjects {
  usersMap: IObjectOfUsers
}

interface IHomeProps extends IReduxStateProps {}

const Home: React.FC<IHomeProps> = ({
  languagesOfLoggedInUser,
  usersByLanguage,
  usersMap
}) => {
  console.log(languagesOfLoggedInUser)
  console.log(usersByLanguage)
  return (
    <div>
      <FavoriteChats {...{ usersMap }} />
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
  if (!dataExists)
    return {
      languagesOfLoggedInUser: [],
      usersByLanguage: [],
      usersMap: {}
    }
  const usersMap: IObjectOfUsers = mapUserById(users)
  return {
    ...groupUsersByLanguage(auth.user, usersMap, userLanguages),
    usersMap
  }
}

export default connect(mapStateToProps)(Home)
