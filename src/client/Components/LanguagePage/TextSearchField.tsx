import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import SearchIcon from '@material-ui/icons/Search'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import styles from './styles'

interface IOwnProps {
  searchUserText: string
  setSearchUserText: (searchUserText: string) => void
}

const TextSearchField: React.FC<IOwnProps> = ({
  searchUserText,
  setSearchUserText
}) => {
  const { bottomMarginLarge } = styles()
  return (
    <FormControl className={bottomMarginLarge}>
      <InputLabel htmlFor="search-user-text">Search Users...</InputLabel>
      <Input
        id="search-user-text"
        value={searchUserText}
        onChange={({ target }) => setSearchUserText(target.value)}
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        }
      ></Input>
    </FormControl>
  )
}

export default TextSearchField
