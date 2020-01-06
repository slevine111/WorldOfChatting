import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../store'
import { RouteComponentProps } from 'react-router-dom'
import { languagePageDataRetrivalThunk } from '../../store/shared/thunks'
import { getUsersOfLanguageInformation } from './helperfunctions'
import { IUsersofLanguageInformation } from './shared-types'
import CurrentChats from './CurrentChats'
import AllUsers from './AllUsers'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import styles from './styles'

interface IMatchParams {
  language: string
}

interface IReduxStatePropsSubset {
  isLoading: boolean
  userLanguagesLength: number
}

interface IReduxStateProps
  extends IUsersofLanguageInformation,
    IReduxStatePropsSubset {}

interface IDispatchProps {
  languagePageDataRetrival: (language: string) => void
}

const LanguagePage: React.FC<RouteComponentProps<IMatchParams> &
  IDispatchProps &
  IReduxStateProps> = ({
  match: {
    params: { language }
  },
  languagePageDataRetrival,
  isLoading,
  userLanguagesLength,
  usersByChatGroup,
  userIdsOfSoloChats,
  usersMap
}) => {
  const { paperPageSection } = styles()
  useEffect(() => {
    languagePageDataRetrival(language)
  }, [language])

  return (
    <div>
      <Typography variant="h6">{language.toLocaleUpperCase()}</Typography>
      {isLoading && <CircularProgress disableShrink />}
      {!isLoading && (
        <Grid container>
          <Grid item xs={12} sm={9}>
            <Paper className={paperPageSection}>
              <Typography variant="h6">Current Chats</Typography>
              {!usersByChatGroup.length && (
                <Typography variant="body1">{`You are not currently chatting with anybody in ${language}. Click on someone below to start chatting!!`}</Typography>
              )}
              {!!usersByChatGroup.length && (
                <CurrentChats {...{ ...{ usersByChatGroup } }} />
              )}
            </Paper>
            <Paper className={paperPageSection}>
              <Typography variant="h6">All Users</Typography>
              {userLanguagesLength === 1 && (
                <Typography variant="body1">{`No other users are signed up for ${language}. More will sign up soon :)`}</Typography>
              )}
              {userLanguagesLength > 1 && (
                <AllUsers
                  {...{ ...{ language, userIdsOfSoloChats, usersMap } }}
                />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <div>under construction</div>
          </Grid>
        </Grid>
      )}
    </div>
  )
}

const mapStateToProps = (
  { userChatGroups, userLanguages, users, chatGroups }: ReduxState,
  {
    match: {
      params: { language }
    }
  }: RouteComponentProps<IMatchParams>
): IReduxStateProps => {
  const isLoading: boolean = [users, userLanguages].some(data => data.isLoading)
  let returnObject: IReduxStatePropsSubset = {
    isLoading,
    userLanguagesLength: userLanguages.data.length
  }
  if (!isLoading) {
    const usersOfLanguageInfo = getUsersOfLanguageInformation(
      users.data.currentLanguageUsers,
      chatGroups,
      userChatGroups.data,
      language
    )
    return { ...returnObject, ...usersOfLanguageInfo }
  } else {
    return {
      ...returnObject,
      usersByChatGroup: [],
      usersMap: {},
      userIdsOfSoloChats: {}
    }
  }
}

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
  return {
    languagePageDataRetrival: (language: string) => {
      dispatch(languagePageDataRetrivalThunk(language))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguagePage)
