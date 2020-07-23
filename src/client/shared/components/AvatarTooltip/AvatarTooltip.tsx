import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import { IReduxStoreUserFields } from '../../../../types-for-both-server-and-client'
import SnippetDirectChat from './SnippetDirectChat'
import SnippetGroupChat from './SnippetGroupChat'
import DotAvatar from './DotAvatar'
import { avatarTooltipStyles } from './styles'

const AvatarTooltip: React.FC<{
  userSingleOrArray: IReduxStoreUserFields | IReduxStoreUserFields[]
  onButtonClick: () => void
  chatGroupId?: string
}> = ({ userSingleOrArray, onButtonClick, chatGroupId }) => {
  const { toolTipDirectChat, toolTipGroupChat, arrow } = avatarTooltipStyles()
  return (
    <Tooltip
      title={
        'firstName' in userSingleOrArray ? (
          <SnippetDirectChat
            userChattingWithLoggedInUser={userSingleOrArray.directChat}
            user={userSingleOrArray}
            onButtonClick={onButtonClick}
          />
        ) : (
          <SnippetGroupChat
            chatGroupId={chatGroupId!}
            onButtonClick={onButtonClick}
          />
        )
      }
      arrow
      placement="right"
      classes={{
        tooltipArrow:
          'firstName' in userSingleOrArray
            ? toolTipDirectChat
            : toolTipGroupChat,
        arrow,
      }}
      interactive={true}
    >
      <span>
        {'firstName' in userSingleOrArray ? (
          <DotAvatar user={userSingleOrArray} />
        ) : (
          <span>
            {userSingleOrArray.slice(0, 3).map((user) => (
              <DotAvatar key={user.id} user={user} />
            ))}
          </span>
        )}
      </span>
    </Tooltip>
  )
}

export default AvatarTooltip
