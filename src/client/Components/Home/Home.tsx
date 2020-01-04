import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { userLoggedInThunk } from '../../store/shared/thunks'
import { IUserAndExpireTime } from '../../store/auth/types'
import { User } from '../../../entities'
import { ReduxState } from '../../store'
import {
  checkIfDataExists,
  IGroupedArraysAndObjects
} from '../utilityfunctions'
import FavoriteChats from './FavoriteChats'
import MyLanguages from './MyLanguages'

interface IReduxStateProps {
  dataLoaded: boolean
  user: User
  tokenExpireTime: number
}

interface IDispatchProps {
  userLoggedInDataRetrival: (userAndExpireTime: IUserAndExpireTime) => void
}

interface IHomeProps extends IReduxStateProps, IDispatchProps {}

const Home: React.FC<IHomeProps> = ({
  dataLoaded,
  user,
  tokenExpireTime,
  userLoggedInDataRetrival
}) => {
  useEffect(() => {
    userLoggedInDataRetrival({ user, expireTime: tokenExpireTime })
  }, [])
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
  chatGroups
}: ReduxState): IReduxStateProps => {
  const {
    user,
    accessTokenFields: { expireTime }
  } = auth
  const dataExistsInput: IGroupedArraysAndObjects = {
    objects: [user],
    arrays: [users.myUsers, Object.keys(chatGroups)]
  }
  const dataLoaded: boolean = checkIfDataExists(dataExistsInput)
  return { dataLoaded, user, tokenExpireTime: expireTime }
}

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
  return {
    userLoggedInDataRetrival: (userAndExpireTime: IUserAndExpireTime): void =>
      dispatch(userLoggedInThunk(userAndExpireTime))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
