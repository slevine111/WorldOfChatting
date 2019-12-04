import React from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../store'
import {
  checkIfDataExists,
  IGroupedArraysAndObjects
} from '../utilityfunctions'
import FavoriteChats from './FavoriteChats'
import MyLanguages from './MyLanguages'

interface IReduxStateProps {
  dataLoaded: boolean
}

interface IHomeProps extends IReduxStateProps {}

const Home: React.FC<IHomeProps> = ({ dataLoaded }) => {
  if (!dataLoaded) return <div>not ready</div>
  return (
    <div>
      <FavoriteChats />
      <MyLanguages />
    </div>
  )
}

const mapStateToProps = ({
  users,
  auth,
  chatGroups,
  userChatGroups
}: ReduxState): IReduxStateProps => {
  const dataExistsInput: IGroupedArraysAndObjects = {
    objects: [auth.user],
    arrays: [users, chatGroups, userChatGroups]
  }
  const dataLoaded: boolean = checkIfDataExists(dataExistsInput)
  return { dataLoaded }
}

export default connect(mapStateToProps)(Home)
