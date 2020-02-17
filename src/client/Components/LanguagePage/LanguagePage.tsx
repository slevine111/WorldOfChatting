import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ReduxState } from '../../store'
import { RouteComponentProps } from 'react-router-dom'
import { languagePageDataRetrivalThunk } from '../../store/APIRequestsHandling/multiplereducerthunks'
import CurrentChats from './CurrentChats'
import AllUsers from './AllUsers'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import styles from './styles'
import WillNameLaterHOC from '../WillNameLaterHOC'
import { RequestDataConstants } from '../../store/APIRequestsHandling/types'
const { WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST } = RequestDataConstants

interface IMatchParams {
  language: string
}

const LanguagePage: React.FC<RouteComponentProps<IMatchParams>> = ({
  match: {
    params: { language }
  }
}) => {
  const dispatch = useDispatch()
  const dataLoading = useSelector(
    ({
      ui: {
        apiCalling: { event, dataLoading }
      }
    }: ReduxState) =>
      event === WENT_TO_SINGLE_LANGUAGE_VIEW_REQUEST && dataLoading
  )
  const { paperPageSection } = styles()
  useEffect(() => {
    dispatch(languagePageDataRetrivalThunk(language))
  }, [language])

  return (
    <div>
      <Typography variant="h6">{language.toLocaleUpperCase()}</Typography>
      {dataLoading && <CircularProgress disableShrink />}
      {!dataLoading && (
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

export default WillNameLaterHOC(LanguagePage)
