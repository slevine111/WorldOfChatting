import React, { useState, ChangeEvent } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import SearchIcon from '@material-ui/icons/Search'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'

import { IOnlineStatusesChecked, IUserLangsTypesChecked } from './shared-types'
import { UserLanguageTypeFieldOptions } from '../../../entities/UserLanguage'
import { OnlineStatusesEnum } from '../../../shared-types/shared-enums'
import styles from './styles'

enum DisplayFilters {
  ONLINE_STATUS = 'Online Status',
  USER_LANG_TYPE = 'Language Type'
}

interface IOwnPropsSidebarSingleColumn<
  T extends UserLanguageTypeFieldOptions | OnlineStatusesEnum
> {
  filterHeading: DisplayFilters
  checkedOptions: T[]
  checkedOptionsCurrentState: { [key in T]: boolean }
  setCheckedOptions: (input: { [key in T]: boolean }) => void
}

const SidebarSingleColumn = <
  T extends UserLanguageTypeFieldOptions | OnlineStatusesEnum
>({
  filterHeading,
  checkedOptions,
  checkedOptionsCurrentState,
  setCheckedOptions
}: IOwnPropsSidebarSingleColumn<T>) => {
  const [open, setOpen] = useState(false)
  const { nestedListItem } = styles()
  return (
    <List>
      <ListItem button onClick={() => setOpen(!open)}>
        <ListItemText primary={filterHeading} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense>
          {checkedOptions.map(curOption => {
            return (
              <ListItem key={curOption} className={nestedListItem}>
                <ListItemText primary={curOption}></ListItemText>
                <ListItemSecondaryAction>
                  <Checkbox
                    checked={checkedOptionsCurrentState[curOption]}
                    onChange={() => {
                      setCheckedOptions({
                        ...checkedOptionsCurrentState,
                        [curOption]: !checkedOptionsCurrentState[curOption]
                      })
                    }}
                    edge="end"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            )
          })}
        </List>
      </Collapse>
    </List>
  )
}

interface IOwnProps {
  onlineStatusesChecked: IOnlineStatusesChecked
  setOnlineStatusesChecked: (olStsChecked: IOnlineStatusesChecked) => void
  userLangsTypesChecked: IUserLangsTypesChecked
  setUserLangsTypesChecked: (ulTypesChecked: IUserLangsTypesChecked) => void
  searchUserText: string
  setSearchUserText: (searchUserText: string) => void
}

const UsersFilterSidebar: React.FC<IOwnProps> = ({
  onlineStatusesChecked,
  setOnlineStatusesChecked,
  userLangsTypesChecked,
  setUserLangsTypesChecked,
  searchUserText,
  setSearchUserText
}) => {
  const { ONLINE_STATUS, USER_LANG_TYPE } = DisplayFilters
  const { Online, Offline } = OnlineStatusesEnum
  const { LEARNER, TEACHER } = UserLanguageTypeFieldOptions

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchUserText(event.target.value)
  }

  return (
    <div>
      <FormControl>
        <InputLabel htmlFor="search-user-text">Search Users...</InputLabel>
        <Input
          id="search-user-text"
          value={searchUserText}
          onChange={handleTextChange}
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          }
        ></Input>
      </FormControl>
      <SidebarSingleColumn
        filterHeading={ONLINE_STATUS}
        checkedOptions={[Online, Offline]}
        checkedOptionsCurrentState={onlineStatusesChecked}
        setCheckedOptions={setOnlineStatusesChecked}
      />
      <SidebarSingleColumn
        filterHeading={USER_LANG_TYPE}
        checkedOptions={[LEARNER, TEACHER]}
        checkedOptionsCurrentState={userLangsTypesChecked}
        setCheckedOptions={setUserLangsTypesChecked}
      />
    </div>
  )
}

export default UsersFilterSidebar
