import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, withRouter } from 'react-router-dom'
import { ReduxState } from '../../store'
import { UserLanguageTypeFieldOptions } from '../../../entities/UserLanguage'
import { IObjectOfUsers, ILanguageObjects } from './index'
import { groupUsersByLanguage } from './helperfunctions'
import Typography from '@material-ui/core/Typography'
import ReactWordCloud from 'react-wordcloud'
import MenuItem from '@material-ui/core/MenuItem'
import Popover from '@material-ui/core/Popover'
import PeopleIconsList from './PeopleIconsList'
import { CallbacksProp } from 'react-wordcloud/dist/types'
import { Word } from 'd3-cloud'

type LanguageDisplayOptions = '' | 'icon' | 'list'

declare module 'd3-cloud' {
  interface Word {
    userType: UserLanguageTypeFieldOptions | null
  }
}

interface IReduxStateProps extends ILanguageObjects {}

interface IOwnProps {
  usersMap: IObjectOfUsers
}

interface IMyLanguagesProps
  extends IReduxStateProps,
    IOwnProps,
    RouteComponentProps {}

const MyLanguages: React.FC<IMyLanguagesProps> = ({
  usersByLanguageMap,
  userCountByLanguageMap,
  userCountByLanguage,
  match,
  history
}) => {
  const [
    selectedLanguageDOMElement,
    setSelectedLanguageDOMElement
  ] = useState<HTMLButtonElement | null>(null)
  const [languageDisplay, setLanguageDisplay] = useState<
    LanguageDisplayOptions
  >('icon')
  const wordCloudCallbacks: CallbacksProp = {
    getWordColor: (word: Word): string => {
      return word.userType === 'teacher' ? 'blue' : 'red'
    },
    onWordClick: (_word: Word, event: MouseEvent | undefined): void => {
      setSelectedLanguageDOMElement(
        ((event as unknown) as React.MouseEvent<HTMLButtonElement>)
          .currentTarget
      )
    }
  }
  const selectedLanguage: string =
    selectedLanguageDOMElement !== null
      ? selectedLanguageDOMElement.textContent!
      : ''
  const userCount: number =
    selectedLanguage !== '' ? userCountByLanguageMap[selectedLanguage].value : 0
  console.log(usersByLanguageMap)
  console.log(selectedLanguage)
  return (
    <div>
      <Typography variant="h6">My Languages</Typography>
      <ReactWordCloud
        words={userCountByLanguage}
        options={{
          enableTooltip: false,
          fontSizes: [30, 60],
          rotations: 0,
          deterministic: true
        }}
        callbacks={wordCloudCallbacks}
      />
      <Popover
        open={selectedLanguageDOMElement !== null}
        anchorEl={selectedLanguageDOMElement}
        onClose={() => setSelectedLanguageDOMElement(null)}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      >
        <MenuItem>
          {selectedLanguage !== '' ? `Go to ${selectedLanguage} page` : ''}
        </MenuItem>
        <MenuItem
          disabled={selectedLanguage !== '' && userCount === 0}
          onClick={() => {
            setLanguageDisplay('icon')
            history.push(`${match.path}/${selectedLanguage}`)
            setSelectedLanguageDOMElement(null)
          }}
        >
          {selectedLanguage === ''
            ? ''
            : userCount > 0
            ? `Show ${userCount} users below`
            : 'No users online'}
        </MenuItem>
      </Popover>
      {languageDisplay === 'icon' && (
        <Route
          exact
          path={`${match.path}/:language`}
          render={({ match }) => (
            <PeopleIconsList {...{ match, usersByLanguageMap }} />
          )}
        />
      )}
    </div>
  )
}

const mapStateToProps = (
  { auth, userLanguages }: ReduxState,
  { usersMap }: IOwnProps
): IReduxStateProps => {
  return groupUsersByLanguage(auth.user, usersMap, userLanguages)
}

export default withRouter(connect(mapStateToProps)(MyLanguages))
