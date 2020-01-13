import React, { useState } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
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
  otherClasses?: any[]
}

const SidebarSingleColumn = <
  T extends UserLanguageTypeFieldOptions | OnlineStatusesEnum
>({
  filterHeading,
  checkedOptions,
  checkedOptionsCurrentState,
  setCheckedOptions,
  otherClasses
}: IOwnPropsSidebarSingleColumn<T>) => {
  const [open, setOpen] = useState(false)
  const { hoverNoBackground, sidebarColumn, listItemRoot } = styles()
  return (
    <List
      disablePadding={true}
      className={`${sidebarColumn} ${
        otherClasses === undefined ? '' : otherClasses.join(' ')
      }`}
    >
      <ListItem
        button
        disableGutters={true}
        disableRipple={true}
        classes={{ button: hoverNoBackground, root: listItemRoot }}
        onClick={() => setOpen(!open)}
      >
        <ListItemText primary={filterHeading} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding dense>
          {checkedOptions.map(curOption => {
            return (
              <ListItem key={curOption}>
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
                    disableRipple={true}
                    edge="end"
                    size="small"
                    color="primary"
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
}

const UsersFilterSidebar: React.FC<IOwnProps> = ({
  onlineStatusesChecked,
  setOnlineStatusesChecked,
  userLangsTypesChecked,
  setUserLangsTypesChecked
}) => {
  const { langTypeBottomMargin } = styles()
  const { ONLINE_STATUS, USER_LANG_TYPE } = DisplayFilters
  const { Online, Offline } = OnlineStatusesEnum
  const { LEARNER, TEACHER } = UserLanguageTypeFieldOptions

  return (
    <div>
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
        otherClasses={[langTypeBottomMargin]}
      />
    </div>
  )
}

export default UsersFilterSidebar
