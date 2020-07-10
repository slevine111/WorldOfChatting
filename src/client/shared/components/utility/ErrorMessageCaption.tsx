import React from 'react'
import Typography from '@material-ui/core/Typography'

const ErrorMessageCaption: React.FC<{ errorMessage: string }> = ({
  errorMessage
}) => {
  return (
    <Typography variant="caption" style={{ color: 'red' }}>
      {errorMessage}
    </Typography>
  )
}

export default ErrorMessageCaption
