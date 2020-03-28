import React, { Fragment } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import Popover from '@material-ui/core/Popover'
import styles from './styles'

interface IOwnProps {
  numberDisplay: number
  onIconClick: (event: any) => void
  iconCurrentlyClickedOn: boolean
  onCloseDisplay: () => void
  displayElement: null | (EventTarget & HTMLButtonElement)
}

const IconHeaderHOC = (
  IconComponent: any,
  DisplayComponent: any
): React.FC<IOwnProps> => {
  return ({
    numberDisplay,
    onIconClick,
    iconCurrentlyClickedOn,
    onCloseDisplay,
    displayElement
  }) => {
    const { inheritColor, defaultColor, modals } = styles()
    return (
      <Fragment>
        <IconButton
          onClick={event => onIconClick(event)}
          className={iconCurrentlyClickedOn ? inheritColor : defaultColor}
        >
          {numberDisplay > 0 ? (
            <Badge badgeContent={numberDisplay} color="secondary">
              <IconComponent />
            </Badge>
          ) : (
            <IconComponent />
          )}
        </IconButton>
        <Popover
          classes={{ paper: modals }}
          open={Boolean(displayElement)}
          anchorEl={displayElement}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          onClose={() => onCloseDisplay()}
        >
          <DisplayComponent onCloseDisplay={onCloseDisplay} />
        </Popover>
      </Fragment>
    )
  }
}

export default IconHeaderHOC
