import React, { ReactElement, ChangeEvent, useState } from 'react'
import DropdownFilter from './DropdownFilter'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { useSelector } from 'react-redux'
import { Language } from '../../../../entities'
import { ReduxState } from '../../../store'
import useStyles from './styles'

const sortLanguages = (
  orderBy: 'asc' | 'desc',
  languages: Language[]
): Language[] => {
  return languages.sort((a: Language, b: Language) => {
    return (orderBy === 'desc' ? 1 : -1) * b.language.localeCompare(a.language)
  })
}

interface IOwnProps {
  handleChange: (
    event: ChangeEvent<HTMLInputElement>,
    language: string,
    signupInfoKey: 'languagesToLearn' | 'languagesToTeach'
  ) => void
  languagesToLearn: string[]
  languagesToTeach: string[]
}

const LanguageSelector: React.FC<IOwnProps> = ({
  handleChange,
  languagesToLearn,
  languagesToTeach
}): ReactElement => {
  const languages = useSelector(({ languages }: ReduxState) =>
    Object.values(languages.byId)
  )
  let [orderDirection, setOrderDirection] = useState<'desc' | 'asc'>('asc')
  let [selectedAndLetterFilter, setSelectedAndLetterFilter] = useState('')
  let languagesToDisplay: Language[] = sortLanguages(orderDirection, languages)
  if (selectedAndLetterFilter === 'Selected Languages') {
    languagesToDisplay = languagesToDisplay.filter(language =>
      [...languagesToLearn, ...languagesToTeach].includes(language.language)
    )
  } else if (selectedAndLetterFilter !== '') {
    languagesToDisplay = languagesToDisplay.filter(
      language => language.language[0] === selectedAndLetterFilter
    )
  }

  const onFilterChange = ({
    target
  }: ChangeEvent<{ name?: string; value: unknown }>): void => {
    if (typeof target.value === 'string') {
      setSelectedAndLetterFilter(target.value)
    }
  }

  const { tableSize } = useStyles()
  return (
    <div>
      <DropdownFilter {...{ selectedAndLetterFilter, onFilterChange }} />
      <div className={tableSize}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  direction={orderDirection}
                  active={true}
                  onClick={() =>
                    setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc')
                  }
                >
                  Language
                </TableSortLabel>
              </TableCell>
              <TableCell>Want to Learn</TableCell>
              <TableCell>Want to Teach</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {languagesToDisplay.map((languageEl: Language) => {
              const { language } = languageEl
              const selectedToTeach: boolean = languagesToTeach.includes(
                language
              )
              const selectedToLearn: boolean = languagesToLearn.includes(
                language
              )
              return (
                <TableRow key={language}>
                  <TableCell component="th" scope="row">
                    {language}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selectedToLearn}
                      disabled={selectedToTeach}
                      onChange={event =>
                        handleChange(event, language, 'languagesToLearn')
                      }
                      color="default"
                      inputProps={{ 'aria-label': 'want to learn checkbox' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selectedToTeach}
                      disabled={selectedToLearn}
                      onChange={event =>
                        handleChange(event, language, 'languagesToTeach')
                      }
                      color="default"
                      inputProps={{ 'aria-label': 'want to teach checkbox' }}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default LanguageSelector
