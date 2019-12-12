import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../store'
import { IAuthReducerUserField } from '../../store/auth/types'
import { RouteComponentProps } from 'react-router-dom'
import { languagePageDataRetrival } from '../../store/shared-actions'
import { checkIfDataExists } from '../utilityfunctions'
import { getUsersOfLanguageInformation } from './helperfunctions'
import { IUsersofLanguageInformation } from './shared-types'
import CurrentChats from './CurrentChats'
import AllUsers from './AllUsers'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

interface IMatchParams {
  language: string
}

interface IReduxStateProps extends IUsersofLanguageInformation {
  user: IAuthReducerUserField
  dataExists: boolean
}

interface IDispatchProps {
  languagePageDataRetrival: (language: string) => void
}

interface ILanguagePageProps
  extends RouteComponentProps<IMatchParams>,
    IDispatchProps,
    IReduxStateProps {}

const LanguagePage: React.FC<ILanguagePageProps> = ({
  match: {
    params: { language }
  },
  languagePageDataRetrival,
  dataExists,
  usersByChatGroup,
  userIdsOfSoloChats,
  usersMap
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  useEffect(() => {
    languagePageDataRetrival(language)
  }, [language])

  if (!dataExists) return <div>not ready</div>
  return (
    <div>
      <Typography variant="h6">{language}</Typography>
      <Paper>
        <CurrentChats {...{ ...{ language, usersByChatGroup } }} />
        <AllUsers {...{ ...{ language, userIdsOfSoloChats, usersMap } }} />
      </Paper>
    </div>
  )
}

const mapStateToProps = (
  {
    auth: { user },
    userChatGroups,
    userLanguages,
    users,
    chatGroups
  }: ReduxState,
  { match: { params } }: RouteComponentProps<IMatchParams>
): IReduxStateProps => {
  const dataExists: boolean = checkIfDataExists({
    objects: [user],
    arrays: [users.currentLanguageUsers, userLanguages]
  })
  if (dataExists) {
    const usersOfLanguageInfo = getUsersOfLanguageInformation(
      users.currentLanguageUsers,
      chatGroups,
      userChatGroups,
      params.language
    )
    return { user, dataExists, ...usersOfLanguageInfo }
  } else {
    return {
      user,
      dataExists,
      usersByChatGroup: [],
      usersMap: {},
      userIdsOfSoloChats: {}
    }
  }
}

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
  return {
    languagePageDataRetrival: (language: string) => {
      dispatch(languagePageDataRetrival(language))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguagePage)
