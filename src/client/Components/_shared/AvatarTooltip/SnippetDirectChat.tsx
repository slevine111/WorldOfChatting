import React from 'react'
import { useSelector } from 'react-redux'
import { ReduxState } from '../../../store'
import { USER_KEY_PREFIX } from '../../../store/userlanguage/constants'
import { IReduxStoreUserFields } from '../../../../types-for-both-server-and-client'
import { UserLanguage } from '../../../../entities'
import Button from '@material-ui/core/Button'
import Typgraphy from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { makeStyles } from '@material-ui/core/styles'

const TableCellNoBorder: React.FC<{ text?: string }> = ({ text = '' }) => {
  const { root } = makeStyles({
    root: { border: 'none', fontSize: '.75rem' },
  })()
  return <TableCell classes={{ root }}>{text}</TableCell>
}

const SnippetDirectChat: React.FC<{
  user: IReduxStoreUserFields
  userChattingWithLoggedInUser: boolean
  onButtonClick: () => void
}> = ({ user, userChattingWithLoggedInUser, onButtonClick }) => {
  const {
    byId: userLangsById,
    subGroupings: userLangsSubGroupings,
  } = useSelector((state: ReduxState) => state.userLanguages)
  const loggedInUserId: string = useSelector(
    (state: ReduxState) => state.auth.user.id
  )
  const loggedInUserLangIds: string[] =
    userLangsSubGroupings[`${USER_KEY_PREFIX}${loggedInUserId}`]
  const langToUserLangMappingLoggedInUser: Record<string, UserLanguage> = {}
  for (let i = 0; i < loggedInUserLangIds.length; ++i) {
    langToUserLangMappingLoggedInUser[
      userLangsById[loggedInUserLangIds[i]].language
    ] = userLangsById[loggedInUserLangIds[i]]
  }

  const { id, firstName, fullName, similarityScore } = user
  return (
    <div style={{ textAlign: 'center' }}>
      <Typgraphy variant="h6">{fullName}</Typgraphy>
      <Typgraphy
        variant="body2"
        style={{ fontStyle: 'italic' }}
      >{`Similarity Score: ${similarityScore}`}</Typgraphy>

      <Table style={{ fontSize: '.95rem', margin: '5px 0 11px' }} size="small">
        <TableHead style={{ fontStyle: 'italic' }}>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>You</TableCell>
            <TableCell>{firstName}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userLangsSubGroupings[`${USER_KEY_PREFIX}${id}`].map((id) => {
            const { language, type } = userLangsById[id]
            return (
              <TableRow key={id}>
                <TableCellNoBorder text={language} />
                <TableCellNoBorder
                  text={langToUserLangMappingLoggedInUser[language].type}
                />
                <TableCellNoBorder text={type} />
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <Button
        onClick={onButtonClick}
        size="small"
        variant="contained"
        color="primary"
        style={{ fontSize: '.7rem' }}
      >
        {userChattingWithLoggedInUser
          ? 'Continue Chatting!'
          : 'Invite to Chat!'}
      </Button>
    </div>
  )
}

export default SnippetDirectChat
