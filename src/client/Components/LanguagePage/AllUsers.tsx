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
import { IReduxStoreUserFields } from '../../../shared-types'
import PersonIconList from './PersonIconList'
import TableList from './TableList'
import InviteToChatDialog from './InviteToChatDialog'
import UsersFilterSidebar from './UsersFilterSidebar'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TablePagination from '@material-ui/core/TablePagination'
import styles from './styles'

interface IReduxStateProps {
  usersOfLanguage: IUserWithLanguageFields[]
}

interface IOwnProps {
  language: string
  usersMap: IObjectOfOneType<IReduxStoreUserFields>
  userIdsOfSoloChats: IObjectOfOneType<true>
}

const AllUsers: React.FC<IReduxStateProps & IOwnProps> = ({
  usersOfLanguage
}) => {
  if (!Array.isArray(usersOfLanguage)) return <div>not ready</div>
  const { allUsersListPadding, allUsersContainerLeftPadding } = styles()
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

  const [rowsPerPage, setRowsPerPage] = useState(50)
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
      <Grid container className={allUsersContainerLeftPadding}>
        <Grid item xs={12} sm={3}>
          <UsersFilterSidebar
            {...{
              onlineStatusesChecked,
              setOnlineStatusesChecked,
              userLangsTypesChecked,
              setUserLangsTypesChecked
            }}
          />{' '}
        </Grid>
        <Grid item xs={12} sm={9} className={allUsersListPadding}>
          {display === 'icon' && (
            <PersonIconList
              {...{
                ...{
                  orderDirectionAndColumn,
                  setOrderDirectionAndColumn,
                  rowsToDisplay,
                  setSelectedUser,
                  searchUserText,
                  setSearchUserText
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
          rowsPerPageOptions={[25, 50, 100]}
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
