import React, { useState } from 'react'
import { IUserWithLanguageFields } from './shared-types'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TablePagination from '@material-ui/core/TablePagination'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import styles from './styles'

interface IOwnProps {
  usersOfLanguage: IUserWithLanguageFields[]
  setSelectedUser: (user: IUserWithLanguageFields) => void
}

interface IColumnAndDB {
  column: string
  db: string
}

//type OrderColumns = 'fullName' | 'loggedIn' | 'userType'
type OrderDirections = 'asc' | 'desc'

const TableList: React.FC<IOwnProps> = ({
  usersOfLanguage,
  setSelectedUser
}) => {
  const { maxTableWidth } = styles()
  const [rowsPerPage, setRowsPerPage] = useState(2)
  const [page, setPage] = useState(0)
  const [orderDirection, setOrderDirection] = useState<OrderDirections>('asc')
  const [orderColumn, setOrderColumn] = useState('fullName')

  const columnAndDBNames: IColumnAndDB[] = [
    { column: 'User', db: 'fullName' },
    { column: 'Online Status', db: 'loggedIn' },
    { column: 'Language Type', db: 'userType' }
  ]

  if (!Array.isArray(usersOfLanguage)) return <div>not ready</div>

  const rowsToDisplay: IUserWithLanguageFields[] = usersOfLanguage
    .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    .sort((a, b) => {
      const firstItemValue: string = (orderColumn !== 'loggedIn'
        ? a[orderColumn]
        : a[orderColumn]
        ? 'Online'
        : 'Offline') as string
      const secondItemValue: string = (orderColumn !== 'loggedIn'
        ? b[orderColumn]
        : b[orderColumn]
        ? 'Online'
        : 'Offline') as string
      return (
        (orderDirection === 'asc' ? 1 : -1) *
        firstItemValue.localeCompare(secondItemValue)
      )
    })

  return (
    <div className={maxTableWidth}>
      <Table stickyHeader aria-label="table-of-users-of-language">
        <TableHead>
          <TableRow>
            {columnAndDBNames.map(row => {
              const { column, db } = row
              return (
                <TableCell key={column} scope="col">
                  {column}
                  <TableSortLabel
                    direction={orderDirection}
                    active={orderColumn === db}
                    onClick={() => {
                      setOrderDirection(
                        orderDirection === 'asc' ? 'desc' : 'asc'
                      )
                      setOrderColumn(db)
                    }}
                  />
                </TableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsToDisplay.map(user => {
            const { loggedIn, userType, id, fullName } = user
            return (
              <TableRow key={id}>
                <TableCell>
                  {fullName}{' '}
                  <IconButton onClick={() => setSelectedUser(user)}>
                    <AddIcon />
                  </IconButton>
                </TableCell>
                <TableCell>{loggedIn ? 'Online' : 'Offline'}</TableCell>
                <TableCell>{`${userType[0].toUpperCase()}${userType.slice(
                  1
                )}`}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[1, 2]}
        component="div"
        count={usersOfLanguage.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onChangePage={(_event, page) => setPage(page)}
        onChangeRowsPerPage={event => {
          setRowsPerPage(Number(event.target.value))
          setPage(0)
        }}
      />
    </div>
  )
}

export default TableList
