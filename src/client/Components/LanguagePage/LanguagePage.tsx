import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../store'
import { RouteComponentProps } from 'react-router-dom'
import { languagePageDataRetrivalThunk } from '../../store/APIRequestsHandling/multiplereducerthunks'
import { getUsersOfLanguageInformation } from './helperfunctions'
import { IUsersofLanguageInformation } from './shared-types'
import { IUserReducerDataSlice } from '../../store/user/reducer'
import { IUserLanguagesOfSingleLanguageDataSlice } from '../../store/userlanguage/reducer'
import CurrentChats from './CurrentChats'
import AllUsers from './AllUsers'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import styles from './styles'
import WillNameLaterHOC from '../WillNameLaterHOC'

interface IMatchParams {
  language: string
}

interface IReduxStateProps extends IUsersofLanguageInformation {
  isLoading: boolean
  reduxStoreDataSlices:
    | []
    | [IUserReducerDataSlice, IUserLanguagesOfSingleLanguageDataSlice]
}

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
              <CurrentChats {...{ ...{ language, usersByChatGroup } }} />
            </Paper>
            <Paper className={paperPageSection}>
              <AllUsers
                {...{ ...{ language, userIdsOfSoloChats, usersMap } }}
              />
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
  const { currentLanguageUsers } = users
  const { ofLanguagePage } = userLanguages
  const isLoading: boolean =
    currentLanguageUsers.isLoading || ofLanguagePage.isLoading
  if (!isLoading) {
    const usersOfLanguageInfo = getUsersOfLanguageInformation(
      currentLanguageUsers.data,
      chatGroups.data,
      userChatGroups.data,
      language
    )
    return {
      isLoading,
      reduxStoreDataSlices: [currentLanguageUsers, ofLanguagePage],
      ...usersOfLanguageInfo
    }
  } else {
    return {
      isLoading,
      reduxStoreDataSlices: [],
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WillNameLaterHOC(LanguagePage))
