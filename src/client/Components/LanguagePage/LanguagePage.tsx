import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../store'
import { RouteComponentProps } from 'react-router-dom'
import { languagePageDataRetrivalThunk } from '../../store/APIRequestsHandling/multiplereducerthunks'
import { IUserReducerState } from '../../store/user/reducer'
import { IUserLanguageReducerState } from '../../store/userlanguage/reducer'
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

interface IReduxStateProps {
  isLoading: boolean
  reduxStoreDataSlices: [IUserReducerState, IUserLanguageReducerState]
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
  isLoading
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
              <CurrentChats language={language} />
            </Paper>
            <Paper className={paperPageSection}>
              <AllUsers language={language} />
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

const mapStateToProps = ({
  userLanguages,
  users
}: ReduxState): IReduxStateProps => {
  const isLoading: boolean = users.isLoading || userLanguages.isLoading
  return {
    isLoading,
    reduxStoreDataSlices: [users, userLanguages]
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
