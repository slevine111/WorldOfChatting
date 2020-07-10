import React from 'react'
import PersonCircle from '../../shared/components/AvatarTooltip/AvatarTooltip'
import TextSearchField from './TextSearchField'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Grid from '@material-ui/core/Grid'
import styles from './styles'
import {
  IOrderDirectionAndColumn,
  IUserWithLanguageFields,
  OrderColumns,
  OrderDirections,
  IDisplayAndDataNames,
} from './shared-types'
import { generateOrderByOptionsIconDisplay } from './helperfunctions'

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
    blockDisplay,
    itemBottomMargin,
    orderByWidth,
    bottomMarginLarge,
  } = styles()

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
          const { userType, id, fullName } = user
          return (
            <Grid item xs={6} sm={4} key={id} className={itemBottomMargin}>
              <PersonCircle
                user={user}
                onButtonClick={() => setSelectedUser(user)}
              />
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
