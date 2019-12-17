import React from 'react'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import chatBioStyles from '../_shared/ChatBio/styles'
import styles from './styles'
import {
  IOrderDirectionAndColumn,
  IUserWithLanguageFields,
  IColumnAndDB,
  OrderColumns,
  OrderDirections
} from './shared-types'

interface IOwnProps {
  orderDirectionAndColumn: IOrderDirectionAndColumn
  setOrderDirectionAndColumn: (
    orderDirectionAndColumn: IOrderDirectionAndColumn
  ) => void
  rowsToDisplay: IUserWithLanguageFields[]
  setSelectedUser: (user: IUserWithLanguageFields) => void
}

const PersonIconList: React.FC<IOwnProps> = ({
  orderDirectionAndColumn,
  setOrderDirectionAndColumn,
  rowsToDisplay,
  setSelectedUser
}) => {
  const {
    loggedInBadge,
    loggedOutBadge,
    dot,
    blockDisplay,
    avatarColor
  } = chatBioStyles()
  const { orderByWidth } = styles()

  const orderByOptions: IColumnAndDB[] = [
    { column: 'User', db: 'fullName', orderDirection: 'asc' },
    { column: 'User', db: 'fullName', orderDirection: 'desc' },
    { column: 'Online Status', db: 'loggedInAsString', orderDirection: 'asc' },
    { column: 'Online Status', db: 'loggedInAsString', orderDirection: 'desc' },
    { column: 'Language Type', db: 'userType', orderDirection: 'asc' },
    { column: 'Language Type', db: 'userType', orderDirection: 'desc' }
  ]

  const { orderColumn, orderDirection } = orderDirectionAndColumn
  return (
    <div>
      <InputLabel htmlFor="order-users-by">Order By</InputLabel>
      <Select
        className={orderByWidth}
        value={`${orderColumn}-${orderDirection}`}
        onChange={({ target }) => {
          if (typeof target.value === 'string') {
            const [orderColumn, orderDirection] = target.value.split('-')
            setOrderDirectionAndColumn({
              orderColumn: orderColumn as OrderColumns,
              orderDirection: orderDirection as OrderDirections
            })
          }
        }}
        id="order-users-by"
      >
        {orderByOptions.map((curOption, idx) => {
          const { column, db, orderDirection } = curOption
          return (
            <MenuItem key={idx} value={`${db}-${orderDirection}`}>
              {`${column} (${
                orderDirection === 'asc' ? 'ascending' : 'descending'
              })`}
            </MenuItem>
          )
        })}
      </Select>
      {rowsToDisplay.map(user => {
        const { loggedIn, firstName, lastName, userType, id, fullName } = user
        return (
          <div key={id}>
            <Badge
              overlap="circle"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              classes={{
                badge: loggedIn ? loggedInBadge : loggedOutBadge,
                dot
              }}
            >
              <Avatar className={avatarColor}>
                <Button
                  onClick={() => setSelectedUser(user)}
                >{`${firstName[0]}${lastName[0]}`}</Button>
              </Avatar>{' '}
            </Badge>
            <Typography variant="body1">
              <b className={blockDisplay}>{fullName}</b>
              <b className={blockDisplay}>{userType}</b>
            </Typography>
          </div>
        )
      })}
    </div>
  )
}

export default PersonIconList
