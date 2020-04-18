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
} from './shared-types'
import { displayAndDataNames } from './constants'

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
  setSelectedUser,
}) => {
  const { maxTableWidth } = styles()

  const { orderDirection, orderColumn } = orderDirectionAndColumn

  return (
    <div className={maxTableWidth}>
      <Table stickyHeader aria-label="table-of-users-of-language">
        <TableHead>
          <TableRow>
            {displayAndDataNames.map((row) => {
              const { display, data } = row
              return (
                <TableCell key={display} scope="col">
                  {display}
                  <TableSortLabel
                    direction={orderDirection}
                    active={orderColumn === data}
                    onClick={() => {
                      setOrderDirectionAndColumn({
                        orderDirection:
                          orderDirection === 'asc' ? 'desc' : 'asc',
                        orderColumn: data,
                      })
                    }}
                  />
                </TableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsToDisplay.map((user) => {
            const { onlineStatus, userType, id, fullName } = user
            return (
              <TableRow key={id}>
                <TableCell>
                  {fullName}{' '}
                  <IconButton onClick={() => setSelectedUser(user)}>
                    <AddIcon />
                  </IconButton>
                </TableCell>
                <TableCell>{onlineStatus}</TableCell>
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
