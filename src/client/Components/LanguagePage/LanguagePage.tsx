import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../store'
import { RouteComponentProps } from 'react-router-dom'
import { languagePageDataRetrival } from './dispatch_functions'
import { checkIfDataExists } from '../utilityfunctions'
import { getUsersOfLanguageInformation } from './helperfunctions'
import { IUsersofLanguageInformation } from './shared-types'
import CurrentChats from './CurrentChats'
import AllUsers from './AllUsers'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import styles from './styles'

interface IMatchParams {
  language: string
}

interface IReduxStateProps extends IUsersofLanguageInformation {
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
  const { paperPageSection } = styles()
  useEffect(() => {
    languagePageDataRetrival(language)
  }, [language])

  if (!dataExists) return <div>not ready</div>
  return (
    <div>
      <Typography variant="h6">{language.toLocaleUpperCase()}</Typography>
      <Grid container>
        <Grid item xs={12} sm={9}>
          <Paper className={paperPageSection}>
            <CurrentChats {...{ ...{ language, usersByChatGroup } }} />
          </Paper>
          <Paper className={paperPageSection}>
            <AllUsers {...{ ...{ language, userIdsOfSoloChats, usersMap } }} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <div>under construction</div>
        </Grid>
      </Grid>
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
  const dataExists: boolean = checkIfDataExists({
    objects: [],
    arrays: [users.currentLanguageUsers, userLanguages]
  })
  if (dataExists) {
    const usersOfLanguageInfo = getUsersOfLanguageInformation(
      users.currentLanguageUsers,
      chatGroups,
      userChatGroups,
      language
    )
    return { dataExists, ...usersOfLanguageInfo }
  } else {
    return {
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
