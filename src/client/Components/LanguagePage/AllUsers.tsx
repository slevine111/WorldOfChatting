import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../store'
import { IUserWithLanguageFields } from './shared-types'
import { getAllUsersOfLanguage } from './helperfunctions'
import { IObjectOfOneType } from '../intercomponent-types'
import { User } from '../../../entities'
import PersonIconList from './PersonIconList'
import InviteToChatDialog from './InviteToChatDialog'
import Typography from '@material-ui/core/Typography'

interface IReduxStateProps {
  usersOfLanguage: IUserWithLanguageFields[]
}

interface IOwnProps {
  language: string
  usersMap: IObjectOfOneType<User>
  userIdsOfSoloChats: IObjectOfOneType<true>
}

const AllUsers: React.FC<IReduxStateProps & IOwnProps> = ({
  usersOfLanguage
}) => {
  const [display, setDisplay] = useState<'icon' | 'table'>('icon')
  const [selectedUser, setSelectedUser] = useState<IUserWithLanguageFields>(
    {} as IUserWithLanguageFields
  )

  return (
    <div>
      <InviteToChatDialog
        selectedUser={selectedUser}
        onClose={() => {
          setSelectedUser({} as IUserWithLanguageFields)
        }}
      />
      <Typography variant="h6">All Users</Typography>
      {display === 'icon' && (
        <PersonIconList {...{ ...{ usersOfLanguage, setSelectedUser } }} />
      )}
    </div>
  )
}

const mapStateToProps = (
  { auth, userLanguages }: ReduxState,
  { language, usersMap, userIdsOfSoloChats }: IOwnProps
): IReduxStateProps => {
  return {
    usersOfLanguage: getAllUsersOfLanguage(
      language,
      auth.user,
      userLanguages,
      usersMap,
      userIdsOfSoloChats
    )
  }
}

export default connect(mapStateToProps)(AllUsers)
