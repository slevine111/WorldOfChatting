import React, { useState } from 'react'
import { useSelector } from 'react-redux'
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
import PersonIconList from './PersonIconList'
import TableList from './TableList'
import InviteToChatDialog from './InviteToChatDialog'
import UsersFilterSidebar from './UsersFilterSidebar'
import Grid from '@material-ui/core/Grid'
import TablePagination from '@material-ui/core/TablePagination'
import Typography from '@material-ui/core/Typography'
import styles from './styles'

interface IOwnProps {
  language: string
}

const AllUsers: React.FC<IOwnProps> = ({ language }) => {
  console.log('rerendering')
  const usersOfLanguage: IUserWithLanguageFields[] = useSelector(
    (state: ReduxState) => {
      const {
        auth: { user },
        userLanguages
      } = state

      return userLanguages.subGroupings[language] !== undefined
        ? getAllUsersOfLanguage(
            language,
            user.id,
            state.userLanguages,
            state.chatGroups,
            state.userChatGroups,
            state.users
          )
        : []
    }
  )

  const { allUsersListPadding, allUsersContainerLeftPadding } = styles()
  //const [display, setDisplay] = useState<'icon' | 'table'>('icon')
  const display: string = 'icon'
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
      {!usersOfLanguage.length && (
        <Typography variant="body1">{`No other users are signed up for ${language}. More will sign up soon :)`}</Typography>
      )}
      {!!usersOfLanguage.length && (
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
      )}
    </div>
  )
}

export default AllUsers
