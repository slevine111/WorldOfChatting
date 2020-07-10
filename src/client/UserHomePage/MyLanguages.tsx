import React, { useState, Fragment } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { ReduxState } from '../../store'
import { UserLanguageTypeFieldOptions } from '../../entities/UserLanguage'
import { IWordCloudArrayObject } from './shared-types'
import { generateWordCloudArray } from './helperfunctions'
import Typography from '@material-ui/core/Typography'
import ReactWordCloud from 'react-wordcloud'
import MenuItem from '@material-ui/core/MenuItem'
import Popover from '@material-ui/core/Popover'
import { CallbacksProp } from 'react-wordcloud/dist/types'
import { Word } from 'd3-cloud'

declare module 'd3-cloud' {
  interface Word {
    userType: UserLanguageTypeFieldOptions
  }
}

interface IReduxStateProps {
  usersCountByLanguage: IWordCloudArrayObject[]
}

interface IMyLanguagesProps extends IReduxStateProps, RouteComponentProps {}

const MyLanguages: React.FC<IMyLanguagesProps> = ({
  usersCountByLanguage,
  history,
}) => {
  const { LEARNER } = UserLanguageTypeFieldOptions
  const [
    selectedLanguageDOMElement,
    setSelectedLanguageDOMElement,
  ] = useState<HTMLButtonElement | null>(null)
  const wordCloudCallbacks: CallbacksProp = {
    getWordColor: (word: Word): string => {
      return word.userType === LEARNER ? 'blue' : 'red'
    },
    onWordClick: (_word: Word, event: MouseEvent | undefined): void => {
      setSelectedLanguageDOMElement(
        ((event as unknown) as React.MouseEvent<HTMLButtonElement>)
          .currentTarget
      )
    },
  }
  const selectedLanguage: string =
    selectedLanguageDOMElement !== null
      ? selectedLanguageDOMElement.textContent!
      : ''
  return (
    <div>
      <Typography variant="h6">My Languages</Typography>
      {!usersCountByLanguage.length && (
        <Typography variant="body1">
          You are not signed up for any languges. Go to your account page and
          add some!!
        </Typography>
      )}
      {usersCountByLanguage.length && (
        <Fragment>
          <ReactWordCloud
            words={usersCountByLanguage}
            options={{
              enableTooltip: false,
              fontSizes: [30, 60],
              rotations: 0,
              deterministic: true,
            }}
            callbacks={wordCloudCallbacks}
          />
          <Popover
            open={selectedLanguageDOMElement !== null}
            anchorEl={selectedLanguageDOMElement}
            onClose={() => setSelectedLanguageDOMElement(null)}
            anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
          >
            <MenuItem
              onClick={() => history.push(`/language/${selectedLanguage}`)}
            >
              {selectedLanguage !== '' ? `Go to ${selectedLanguage} page` : ''}
            </MenuItem>
          </Popover>
        </Fragment>
      )}
    </div>
  )
}

const mapStateToProps = ({
  userLanguages,
  chatGroups,
}: ReduxState): IReduxStateProps => {
  return {
    usersCountByLanguage: generateWordCloudArray(userLanguages, chatGroups),
  }
}

export default withRouter(connect(mapStateToProps)(MyLanguages))
