import { createConnection } from 'typeorm'
import seedManualData from './src/bin/seed_manual'
import { createMessages, ILanguageAndCountries } from './src/bin/seed_common'

const createLanguages = (): ILanguageAndCountries[] => {
  return [
    { language: 'Swahili', countries: ['Tanzania'] },
    { language: 'French', countries: ['France'] },
    { language: 'Japanese', countries: ['Japan'] },
    { language: 'Spanish', countries: ['Spain'] },
    { language: 'Turkish', countries: ['Turkey'] },
    { language: 'Mandarin', countries: ['China'] },
    { language: 'English', countries: ['United States'] },
    { language: 'Czech', countries: ['Czech Republic'] },
    { language: 'Dutch', countries: ['Metherlands'] },
    { language: 'Woleaian', countries: ['My country'] }
  ]
}
createLanguages.isAsync = false

export default async () => {
  const { userChatGroups } = await seedManualData(createLanguages, 'test')
  let connection = await createConnection('test')
  await connection.synchronize(false)
  await createMessages(userChatGroups, connection.name)
  await connection.close()
  console.log('test data seeded')
}
