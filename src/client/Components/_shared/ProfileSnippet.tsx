import React from 'react'
import { useSelector } from 'react-redux'
import { ReduxState } from '../../store'
import { USER_KEY_PREFIX } from '../../store/userlanguage/constants'
import { IReduxStoreUserFields } from '../../../types-for-both-server-and-client'
import { UserLanguage } from '../../../entities'
import Button from '@material-ui/core/Button'
import Typgraphy from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

const ProfileSnippet: React.FC<{
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
    <div>
      <Typgraphy variant="h6">{fullName}</Typgraphy>
      <Typgraphy variant="body1">{`Similarity Score: ${similarityScore}`}</Typgraphy>

      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Language</TableCell>
            <TableCell>You</TableCell>
            <TableCell>{firstName}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userLangsSubGroupings[`${USER_KEY_PREFIX}${id}`].map((id) => {
            const { language, type } = userLangsById[id]
            return (
              <TableRow key={id}>
                <TableCell>{language}</TableCell>
                <TableCell>
                  {langToUserLangMappingLoggedInUser[language].type}
                </TableCell>
                <TableCell>{type}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Button onClick={() => onButtonClick()}>
        {userChattingWithLoggedInUser
          ? 'Continue Chatting!'
          : 'Invite to Chat!'}
      </Button>
    </div>
  )
}

export default ProfileSnippet
