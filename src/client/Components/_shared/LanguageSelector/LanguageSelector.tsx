import React, { ReactElement, ChangeEvent, useState } from 'react'
import DropdownFilter from './DropdownFilter'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'

interface ITemp {
  id: string
  language: string
}

let temp: ITemp[] = []
for (let i = 0; i < 30; ++i) {
  temp.push({ id: `b${i}`, language: `b${i}` })
}
temp.push({ id: 'dfsg', language: 'aedsdrgf' })

const sortLanguages = (
  orderBy: 'asc' | 'desc',
  languages: ITemp[]
): ITemp[] => {
  return languages.sort((a: ITemp, b: ITemp) => {
    return (orderBy === 'desc' ? 1 : -1) * b.language.localeCompare(a.language)
  })
}

interface ILanguageSelectorProps {
  handleChange: (
    event: ChangeEvent<HTMLInputElement>,
    language: string,
    signupInfoKey: 'languagesToLearn' | 'languagesToTeach'
  ) => void
  languagesToLearn: string[]
  languagesToTeach: string[]
}

const LanguageSelector: React.FC<ILanguageSelectorProps> = ({
  handleChange,
  languagesToLearn,
  languagesToTeach
}): ReactElement => {
  let [showOnly10, setShowOnly10] = useState(true)
  let [orderDirection, setOrderDirection]: [
    'desc' | 'asc' | undefined,
    any
  ] = useState('asc')
  let [selectedAndLetterFilter, setSelectedAndLetterFilter] = useState('')
  let languagesToDisplay: ITemp[] = sortLanguages(orderDirection, temp)
  if (showOnly10) languagesToDisplay = languagesToDisplay.slice(0, 10)
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
    setShowOnly10(false)
    setSelectedAndLetterFilter(target.value as string)
  }

  return (
    <div>
      <DropdownFilter {...{ selectedAndLetterFilter, onFilterChange }} />
      <Table>
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
          {languagesToDisplay.map((languageEl: ITemp) => {
            const { id, language } = languageEl
            const selectedToTeach: boolean = languagesToTeach.includes(language)
            const selectedToLearn: boolean = languagesToLearn.includes(language)
            return (
              <TableRow key={id}>
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
      {selectedAndLetterFilter === '' && showOnly10 && (
        <div>
          <Typography variant="body1">
            {' '}
            <i
              className="far fa-plus-square"
              onClick={() => setShowOnly10(false)}
            />
            {`And ${temp.length - 10} more!!`}
          </Typography>
        </div>
      )}{' '}
      {selectedAndLetterFilter === '' && !showOnly10 && (
        <Typography variant="body1">
          <i
            className="far fa-minus-square"
            onClick={() => {
              setOrderDirection('asc')
              setShowOnly10(true)
            }}
          />
          Show fewer
        </Typography>
      )}
    </div>
  )
}

export default LanguageSelector
