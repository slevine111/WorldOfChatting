import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../store'
import { IUserWithLanguageFields } from './shared-types'
import { getAllUsersOfLanguage } from './helperfunctions'
import { IObjectOfOneType } from '../intercomponent-types'
import { IUserFieldsForStore } from '../../../shared-types'
import PersonIconList from './PersonIconList'
import TableList from './TableList'
import InviteToChatDialog from './InviteToChatDialog'
import UsersFilterSidebar from './UsersFilterSidebar'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

interface IReduxStateProps {
  usersOfLanguage: IUserWithLanguageFields[]
}

interface IOwnProps {
  language: string
  usersMap: IObjectOfOneType<IUserFieldsForStore>
  userIdsOfSoloChats: IObjectOfOneType<true>
}

const AllUsers: React.FC<IReduxStateProps & IOwnProps> = ({
  usersOfLanguage
}) => {
  const [display, setDisplay] = useState<'icon' | 'table'>('table')
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
      <Grid container>
        <Grid item xs={12} sm={2}>
          <UsersFilterSidebar />{' '}
        </Grid>
        <Grid item xs={12} sm={10}>
          {display === 'icon' && (
            <PersonIconList {...{ ...{ usersOfLanguage, setSelectedUser } }} />
          )}
          {display === 'table' && (
            <TableList {...{ ...{ usersOfLanguage, setSelectedUser } }} />
          )}
        </Grid>
      </Grid>
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
