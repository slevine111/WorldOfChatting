import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import styles from './styles'
import {
  IOrderDirectionAndColumn,
  IUserWithLanguageFields,
  IColumnAndDB
} from './shared-types'

interface IOwnProps {
  orderDirectionAndColumn: IOrderDirectionAndColumn
  setOrderDirectionAndColumn: (
    orderDirectionAndColumn: IOrderDirectionAndColumn
  ) => void
  rowsToDisplay: IUserWithLanguageFields[]
  setSelectedUser: (user: IUserWithLanguageFields) => void
}

const TableList: React.FC<IOwnProps> = ({
  orderDirectionAndColumn,
  setOrderDirectionAndColumn,
  rowsToDisplay,
  setSelectedUser
}) => {
  const { maxTableWidth } = styles()

  const { orderDirection, orderColumn } = orderDirectionAndColumn

  const columnAndDBNames: IColumnAndDB[] = [
    { column: 'User', db: 'fullName' },
    { column: 'Online Status', db: 'loggedInAsString' },
    { column: 'Language Type', db: 'userType' }
  ]

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
                      setOrderDirectionAndColumn({
                        orderDirection:
                          orderDirection === 'asc' ? 'desc' : 'asc',
                        orderColumn: db
                      })
                    }}
                  />
                </TableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsToDisplay.map(user => {
            const { loggedInAsString, userType, id, fullName } = user
            return (
              <TableRow key={id}>
                <TableCell>
                  {fullName}{' '}
                  <IconButton onClick={() => setSelectedUser(user)}>
                    <AddIcon />
                  </IconButton>
                </TableCell>
                <TableCell>{loggedInAsString}</TableCell>
                <TableCell>{`${userType[0].toUpperCase()}${userType.slice(
                  1
                )}`}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default TableList
