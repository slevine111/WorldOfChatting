import moment, { Moment } from 'moment'

export const getDatetimeToDisplayInSidebar = (
  messageDatetime: Date
): string => {
  const messageMoment: Moment = moment(messageDatetime)
  const currentDateTime: Moment = moment()
  if (currentDateTime.isSame(messageMoment, 'day')) {
    return messageMoment.format('LT')
  } else if (currentDateTime.isSame(messageMoment, 'year')) {
    return messageMoment.format('MMM D')
  } else {
    return messageMoment.format('M/D/YY')
  }
}
