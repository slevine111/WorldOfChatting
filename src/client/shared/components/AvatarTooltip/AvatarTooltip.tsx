import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import { IReduxStoreUserFields } from '../../../../types-for-both-server-and-client'
import SnippetDirectChat from './SnippetDirectChat'
import SnippetGroupChat from './SnippetGroupChat'
import DotAvatar from '../BaseAvatar/AvatarDirectChat'
import styles from './styles'

const AvatarTooltip: React.FC<{
  userSingleOrArray: IReduxStoreUserFields | IReduxStoreUserFields[]
  onButtonClick: () => void
  chatGroupId?: string
}> = ({ userSingleOrArray, onButtonClick, chatGroupId }) => {
  const { toolTipDirectChat, toolTipGroupChat, arrow } = styles()
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
            {userSingleOrArray.map((user) => (
              <DotAvatar user={user} />
            ))}
          </span>
        )}
      </span>
    </Tooltip>
  )
}

export default AvatarTooltip
