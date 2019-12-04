import React, { useState } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { ReduxState } from '../../store'
import { UserLanguageTypeFieldOptions } from '../../../entities/UserLanguage'
import { IWordCloudArrayObject } from './index'
import { generateWordCloudArray } from './helperfunctions'
import Typography from '@material-ui/core/Typography'
import ReactWordCloud from 'react-wordcloud'
import MenuItem from '@material-ui/core/MenuItem'
import Popover from '@material-ui/core/Popover'
import { CallbacksProp } from 'react-wordcloud/dist/types'
import { Word } from 'd3-cloud'

declare module 'd3-cloud' {
  interface Word {
    userType: UserLanguageTypeFieldOptions | null
  }
}

interface IReduxStateProps {
  usersCountByLanguage: IWordCloudArrayObject[]
}

interface IMyLanguagesProps extends IReduxStateProps, RouteComponentProps {}

const MyLanguages: React.FC<IMyLanguagesProps> = ({
  usersCountByLanguage,
  match,
  history
}) => {
  const [
    selectedLanguageDOMElement,
    setSelectedLanguageDOMElement
  ] = useState<HTMLButtonElement | null>(null)
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
  console.log(usersCountByLanguage)
  console.log(selectedLanguage)
  return (
    <div>
      <Typography variant="h6">My Languages</Typography>
      <ReactWordCloud
        words={usersCountByLanguage}
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
      </Popover>
    </div>
  )
}

const mapStateToProps = ({ auth }: ReduxState): IReduxStateProps => {
  return { usersCountByLanguage: generateWordCloudArray(auth.user) }
}

export default withRouter(connect(mapStateToProps)(MyLanguages))
