import React from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../store'
import { IReturnObject } from './index'
import { groupUsersByLanguage } from './helperfunctions'
import {
  checkIfDataExists,
  IGroupedArraysAndObjects
} from '../utilityfunctions'

interface IReduxStateProps extends IReturnObject {}

interface IHomeProps extends IReduxStateProps {}

const Home: React.FC<IHomeProps> = ({
  languagesOfLoggedInUser,
  usersByLanguageMap
}) => {
  console.log(languagesOfLoggedInUser)
  console.log(usersByLanguageMap)
  return <div>23</div>
}

const mapStateToProps = ({
  users,
  userLanguages,
  languages,
  auth
}: ReduxState): IReduxStateProps => {
  const dataExistsInput: IGroupedArraysAndObjects = {
    objects: [auth.user],
    arrays: [users, userLanguages, languages]
  }
  const dataExists: boolean = checkIfDataExists(dataExistsInput)
  if (!dataExists)
    return { languagesOfLoggedInUser: [], usersByLanguageMap: {} }
  return groupUsersByLanguage(auth.user, users, userLanguages, languages)
}

export default connect(mapStateToProps)(Home)
