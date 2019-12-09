import React from 'react'
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

const InviteToChatDialog: React.FC<IOwnProps> = ({ selectedUser, onClose }) => {
  const { id, firstName } = selectedUser
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
          <Button color="primary" variant="contained">
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

export default InviteToChatDialog
