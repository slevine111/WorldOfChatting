import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../store'
import { IAuthReducerUserField } from '../../store/auth/types'
import { RouteComponentProps } from 'react-router-dom'
import { languagePageDataRetrival } from '../../store/shared-actions'

interface IMatchParams {
  language: string
}

interface IReduxStateProps {
  user: IAuthReducerUserField
}

interface IDispatchProps {
  languagePageDataRetrival: (language: string, userId: string) => void
}

interface ILanguagePageProps
  extends RouteComponentProps<IMatchParams>,
    IDispatchProps,
    IReduxStateProps {}

const LanguagePage: React.FC<ILanguagePageProps> = ({
  match,
  languagePageDataRetrival,
  user
}) => {
  useEffect(() => {
    languagePageDataRetrival(match.params.language, user.id)
  })

  return <div>23</div>
}

const mapStateToProps = ({ auth }: ReduxState): IReduxStateProps => ({
  user: auth.user
})

const mapDispatchToProps = (dispatch: any): IDispatchProps => {
  return {
    languagePageDataRetrival: (language: string, userId: string) => {
      dispatch(languagePageDataRetrival(language, userId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguagePage)
