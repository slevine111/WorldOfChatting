import React from 'react'
import { User } from '../../../entities'
import { UserLanguageTypeFieldOptions } from '../../../entities/UserLanguage'
import { match } from 'react-router'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import styles from './styles'

interface IUserWithLanguageType extends User {
  type: UserLanguageTypeFieldOptions
}

interface IUsersByLanguage {
  language: string
  users: IUserWithLanguageType[]
}

interface IObjectOfUsersByLanguage {
  [key: string]: IUsersByLanguage
}

interface IMatchParams {
  language: string
}

interface IOwnProps {
  usersByLanguageMap: IObjectOfUsersByLanguage
}

interface IPeopleIconsListProps extends IOwnProps {
  match: match<IMatchParams>
}

const PeopleIconsList: React.FC<IPeopleIconsListProps> = ({
  usersByLanguageMap,
  match: { params }
}) => {
  const { loggedInBadge, loggedOutBadge, dot, avatarColor } = styles()
  const { users } = usersByLanguageMap[params.language]
  return (
    <Grid container>
      {users.map(user => {
        const { loggedIn, firstName, lastName, id } = user
        return (
          <Grid item xs={4} key={id}>
            <Badge
              overlap="circle"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              classes={{
                badge: loggedIn ? loggedInBadge : loggedOutBadge,
                dot
              }}
            >
              <Avatar className={avatarColor}>
                <Button onClick={() => console.log('/about')}>
                  {`${firstName[0]}${lastName[0]}`}
                </Button>
              </Avatar>{' '}
            </Badge>
            <Typography variant="body1">
              <b>{`${firstName} ${lastName}`}</b>
            </Typography>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default PeopleIconsList
