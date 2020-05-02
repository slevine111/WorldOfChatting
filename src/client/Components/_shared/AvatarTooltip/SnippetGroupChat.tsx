import React from 'react'
import { useSelector } from 'react-redux'
import { ReduxState } from '../../../store'
import Typgraphy from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { getCountsByCommonLanguages } from './helperfunctions'

const SnippetGroupChat: React.FC<{
  chatGroupId: string
  onButtonClick: () => void
}> = ({ chatGroupId, onButtonClick }) => {
  const { primary, dense, listItemRoot, listItemTextRoot } = makeStyles({
    primary: { fontSize: '.8rem' },
    dense: { paddingTop: '2px', paddingBottom: '2px' },
    listItemRoot: { textAlign: 'center' },
    listItemTextRoot: { margin: '2px 0' },
  })()
  const {
    countByLanguage,
    numberUsersOnline,
    numberUsersTotal,
    firstUserFullName,
  } = useSelector((state: ReduxState) => {
    return getCountsByCommonLanguages(
      chatGroupId,
      state.users,
      state.userChatGroups,
      state.userLanguages
    )
  })
  const { name } = useSelector(
    (state: ReduxState) => state.chatGroups.byId[chatGroupId]
  )

  return (
    <div style={{ textAlign: 'center' }}>
      <Typgraphy variant="h6">
        {name || `${firstUserFullName} & ${numberUsersTotal - 1} more`}
      </Typgraphy>
      <Typgraphy variant="body2" style={{ fontStyle: 'italic' }}>
        {`${numberUsersOnline}/${numberUsersTotal} online`}
      </Typgraphy>

      <Typgraphy
        variant="body1"
        style={{ paddingTop: '15px', fontStyle: 'italic' }}
      >
        Common Languages
      </Typgraphy>
      <List style={{ paddingTop: '0px' }} dense={true}>
        {countByLanguage.map((langAndCount) => {
          return (
            <ListItem
              key={langAndCount[0]}
              classes={{ dense, root: listItemRoot }}
            >
              <ListItemText
                classes={{ primary, dense, root: listItemTextRoot }}
                primary={`${langAndCount[0]}: ${langAndCount[1]} ${
                  langAndCount[1] === 1 ? 'person' : 'people'
                }`}
              />
            </ListItem>
          )
        })}
      </List>
      <Button
        onClick={onButtonClick}
        size="small"
        variant="contained"
        color="primary"
        style={{ fontSize: '.7rem' }}
      >
        Continue Chatting!
      </Button>
    </div>
  )
}

export default SnippetGroupChat
