import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../store'
import { IObjectOfUsers, ILanguageObjects } from './index'
import { groupUsersByLanguage } from './helperfunctions'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

interface IReduxStateProps extends ILanguageObjects {}

interface IOwnProps {
  usersMap: IObjectOfUsers
}

interface IMyLanguagesProps extends IReduxStateProps, IOwnProps {}

type LanguageDisplayOptions = 'icon' | 'list'

const MyLanguages: React.FC<IMyLanguagesProps> = ({
  languagesOfLoggedInUser,
  usersByLanguageMap
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [languageDisplay, setLanguageDisplay] = useState<
    LanguageDisplayOptions
  >('list')

  const handleChange = (language: string): void => {
    setSelectedLanguage(selectedLanguage !== language ? language : '')
  }

  return (
    <div>
      <Typography variant="h6">My Languages</Typography>
      <Grid container>
        <Grid item xs={3}>
          {languagesOfLoggedInUser.map(l => {
            const { id, language } = l
            return (
              <Grid item xs={12} key={id}>
                <Button
                  variant={
                    l.language === selectedLanguage ? 'contained' : 'outlined'
                  }
                  color={
                    l.language === selectedLanguage ? 'primary' : 'default'
                  }
                  onClick={() => handleChange(l.language)}
                >
                  {language}
                </Button>
              </Grid>
            )
          })}
        </Grid>
      </Grid>
    </div>
  )
}

const mapStateToProps = (
  { auth, userLanguages }: ReduxState,
  { usersMap }: IOwnProps
): IReduxStateProps => {
  return groupUsersByLanguage(auth.user, usersMap, userLanguages)
}

export default connect(mapStateToProps)(MyLanguages)
