import React, { ReactElement, ChangeEvent } from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'

interface IDropdownFilterProps {
  selectedAndLetterFilter: string
  onFilterChange: (
    event: ChangeEvent<{ name?: string; value: unknown }>
  ) => void
}

const listItems: string[] = [
  'Selected Languages',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
]

const DropdownFilter: React.FC<IDropdownFilterProps> = ({
  selectedAndLetterFilter,
  onFilterChange
}): ReactElement => {
  return (
    <div>
      <InputLabel htmlFor="selected-and-letter-filter">
        Filter Languages
      </InputLabel>
      <Select
        style={{ width: '30%' }}
        value={selectedAndLetterFilter}
        onChange={onFilterChange}
        inputProps={{
          name: 'selected-and-lette-rfilter',
          id: 'selected-and-letter-filter'
        }}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {listItems.map((listItem, idx) => {
          return (
            <MenuItem key={idx} value={listItem}>
              {listItem}
            </MenuItem>
          )
        })}
      </Select>
    </div>
  )
}

export default DropdownFilter
