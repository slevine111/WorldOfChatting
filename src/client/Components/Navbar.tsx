import React, { ReactElement } from 'react'
import { Link } from 'react-router-dom'

//Material-UI components
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

//MaterIal-UI style imports
import { makeStyles } from '@material-ui/core/styles'
import { Style } from 'jss'

const useStyles: Style = makeStyles({
  aboutLink: {
    textDecoration: 'none',
    color: 'white',
    marginLeft: '10%'
  }
})

const Navbar: React.FC<{}> = (): ReactElement => {
  const classes = useStyles()
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6">World of Chatting</Typography>
        <Link to="/about" className={classes.aboutLink}>
          About
        </Link>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
