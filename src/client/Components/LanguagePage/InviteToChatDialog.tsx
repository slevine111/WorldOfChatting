import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { ReduxState } from '../../store/'
import { chatGroupInviteThunk } from '../../store/chatgroupinvite/actions'
import { IUserWithLanguageFields } from './shared-types'
import { generateStringFromLanguageTypeCombo } from './helperfunctions'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import Button from '@material-ui/core/Button'

interface IOwnProps {
  selectedUser: IUserWithLanguageFields
  onClose: () => void
}

const InviteToChatDialog: React.FC<IOwnProps &
  RouteComponentProps<{ language: string }>> = ({
  selectedUser,
  onClose,
  match: {
    params: { language }
  }
}) => {
  const { id, firstName } = selectedUser
  const senderUserId: string = useSelector(
    ({ auth }: ReduxState) => auth.user.id
  )
  const dispatch = useDispatch()
  return (
    <Dialog
      open={id !== undefined}
      onClose={onClose}
      aria-describedby="invitetochat-dialog"
    >
      <DialogContent>
        <DialogContentText id="invitetochat-dialog">
          {`Invite ${firstName} to chat and ${generateStringFromLanguageTypeCombo(
            selectedUser
          )}!`}
        </DialogContentText>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() =>
              dispatch(
                chatGroupInviteThunk({ senderUserId, language }, id)
              ).then(() => onClose())
            }
          >
            Yes
          </Button>
          <Button color="secondary" variant="contained" onClick={onClose}>
            No
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default withRouter(InviteToChatDialog)
