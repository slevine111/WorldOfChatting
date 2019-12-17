import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../store'
import {
  IUserWithLanguageFields,
  IOnlineStatusesChecked,
  IUserLangsTypesChecked,
  IOrderDirectionAndColumn
} from './shared-types'
import {
  getAllUsersOfLanguage,
  filterUsers,
  getUsersToDisplayFromFilteredUsers
} from './helperfunctions'
import { IObjectOfOneType } from '../intercomponent-types'
import { IUserFieldsForStore } from '../../../shared-types'
import PersonIconList from './PersonIconList'
import TableList from './TableList'
import InviteToChatDialog from './InviteToChatDialog'
import UsersFilterSidebar from './UsersFilterSidebar'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TablePagination from '@material-ui/core/TablePagination'

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
  if (!Array.isArray(usersOfLanguage)) return <div>not ready</div>
  const [display, setDisplay] = useState<'icon' | 'table'>('icon')
  const [onlineStatusesChecked, setOnlineStatusesChecked] = useState<
    IOnlineStatusesChecked
  >({ Online: true, Offline: true })
  const [userLangsTypesChecked, setUserLangsTypesChecked] = useState<
    IUserLangsTypesChecked
  >({ Learner: true, Teacher: true })
  const [selectedUser, setSelectedUser] = useState<IUserWithLanguageFields>(
    {} as IUserWithLanguageFields
  )
  const [searchUserText, setSearchUserText] = useState('')

  const [rowsPerPage, setRowsPerPage] = useState(2)
  const [page, setPage] = useState(0)

  const [orderDirectionAndColumn, setOrderDirectionAndColumn] = useState<
    IOrderDirectionAndColumn
  >({ orderDirection: 'asc', orderColumn: 'fullName' })

  const filteredUsers: IUserWithLanguageFields[] = filterUsers(
    usersOfLanguage,
    onlineStatusesChecked,
    userLangsTypesChecked,
    searchUserText
  )
  const rowsToDisplay: IUserWithLanguageFields[] = getUsersToDisplayFromFilteredUsers(
    filteredUsers,
    page,
    rowsPerPage,
    orderDirectionAndColumn
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
          <UsersFilterSidebar
            {...{
              onlineStatusesChecked,
              setOnlineStatusesChecked,
              userLangsTypesChecked,
              setUserLangsTypesChecked,
              searchUserText,
              setSearchUserText
            }}
          />{' '}
        </Grid>
        <Grid item xs={12} sm={10}>
          {display === 'icon' && (
            <PersonIconList
              {...{
                ...{
                  orderDirectionAndColumn,
                  setOrderDirectionAndColumn,
                  rowsToDisplay,
                  setSelectedUser
                }
              }}
            />
          )}
          {display === 'table' && (
            <TableList
              {...{
                ...{
                  orderDirectionAndColumn,
                  setOrderDirectionAndColumn,
                  rowsToDisplay,
                  setSelectedUser
                }
              }}
            />
          )}
        </Grid>
        <TablePagination
          rowsPerPageOptions={[1, 2]}
          component="div"
          count={filteredUsers.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onChangePage={(_event, page) => setPage(page)}
          onChangeRowsPerPage={event => {
            setRowsPerPage(Number(event.target.value))
            setPage(0)
          }}
        />
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
