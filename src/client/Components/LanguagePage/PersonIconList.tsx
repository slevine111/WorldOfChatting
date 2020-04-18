import React from 'react'
import TextSearchField from './TextSearchField'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Grid from '@material-ui/core/Grid'
import chatBioStyles from '../_shared/ChatBio/styles'
import styles from './styles'
import {
  IOrderDirectionAndColumn,
  IUserWithLanguageFields,
  OrderColumns,
  OrderDirections,
  IDisplayAndDataNames,
} from './shared-types'
import { generateOrderByOptionsIconDisplay } from './helperfunctions'
import { OnlineStatuses } from '../../../entities/User'

interface IOwnProps {
  orderDirectionAndColumn: IOrderDirectionAndColumn
  setOrderDirectionAndColumn: (
    orderDirectionAndColumn: IOrderDirectionAndColumn
  ) => void
  rowsToDisplay: IUserWithLanguageFields[]
  setSelectedUser: (user: IUserWithLanguageFields) => void
  searchUserText: string
  setSearchUserText: (searchUserText: string) => void
}

const PersonIconList: React.FC<IOwnProps> = ({
  orderDirectionAndColumn,
  setOrderDirectionAndColumn,
  rowsToDisplay,
  setSelectedUser,
  searchUserText,
  setSearchUserText,
}) => {
  const {
    loggedInBadge,
    loggedOutBadge,
    dot,
    blockDisplay,
    avatarColor,
    itemBottomMargin,
  } = chatBioStyles()
  const { orderByWidth, bottomMarginLarge } = styles()

  const orderByOptions: IDisplayAndDataNames[] = generateOrderByOptionsIconDisplay()

  const { orderColumn, orderDirection } = orderDirectionAndColumn
  return (
    <div>
      <Grid container>
        <Grid item xs={6}>
          <TextSearchField {...{ searchUserText, setSearchUserText }} />
        </Grid>
        <Grid item xs={6} className={bottomMarginLarge}>
          <InputLabel htmlFor="order-users-by">Order By</InputLabel>
          <Select
            className={orderByWidth}
            value={`${orderColumn}-${orderDirection}`}
            onChange={({ target }) => {
              if (typeof target.value === 'string') {
                const [orderColumn, orderDirection] = target.value.split('-')
                setOrderDirectionAndColumn({
                  orderColumn: orderColumn as OrderColumns,
                  orderDirection: orderDirection as OrderDirections,
                })
              }
            }}
            id="order-users-by"
          >
            {orderByOptions.map((curOption, idx) => {
              const { display, data, orderDirection } = curOption
              return (
                <MenuItem key={idx} value={`${data}-${orderDirection}`}>
                  {`${display} (${
                    orderDirection === 'asc' ? 'ascending' : 'descending'
                  })`}
                </MenuItem>
              )
            })}
          </Select>
        </Grid>
      </Grid>
      <Grid container>
        {rowsToDisplay.map((user) => {
          const {
            onlineStatus,
            firstName,
            lastName,
            userType,
            id,
            fullName,
          } = user
          return (
            <Grid item xs={6} sm={4} key={id} className={itemBottomMargin}>
              <Badge
                overlap="circle"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                classes={{
                  badge:
                    onlineStatus !== OnlineStatuses.OFFLINE
                      ? loggedInBadge
                      : loggedOutBadge,
                  dot,
                }}
              >
                <Avatar className={avatarColor}>
                  <Button
                    onClick={() => setSelectedUser(user)}
                  >{`${firstName[0]}${lastName[0]}`}</Button>
                </Avatar>{' '}
              </Badge>
              <Typography variant="body1">
                {fullName}
                <em className={blockDisplay}>{userType}</em>
              </Typography>
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}

export default PersonIconList
