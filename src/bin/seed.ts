import dbInit from '../server/db'
import {
  ChatGroup,
  User,
  UserLanguage,
  UserChatGroup,
  Message
} from '../server/db/entity'
import { getRepository, Repository } from 'typeorm'

interface IUserSubset {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}

interface IUserLanguageSubset {
  type: string
  language: string
  numberOfYears?: number
  user: User
}

interface IChatGroupSubset {
  language: string
  name?: string
}

interface IUserChatGroupSubset {
  user: User
  chatGroup: ChatGroup
}

interface IMessageSubset {
  body: string
  userChatGroup: UserChatGroup
}

const createUsers = (): Promise<User[]> => {
  const userRepository: Repository<User> = getRepository(User)

  const usersArray: IUserSubset[] = [
    {
      firstName: 'Joe',
      lastName: 'Roberts',
      username: 'jroberts',
      email: 'jroberts@gmail.com',
      password: '12345'
    },
    {
      firstName: 'Kim',
      lastName: 'Levine',
      username: 'klevine',
      email: 'klevine@gmail.com',
      password: '1234'
    },
    {
      firstName: 'Mike',
      lastName: 'Anderson',
      username: 'manderson',
      email: 'manderson@gmail.com',
      password: '123'
    }
  ]

  return userRepository.save(usersArray)
}

const createChatGroups = (): Promise<ChatGroup[]> => {
  let chatGroupsArray: IChatGroupSubset[] = []
  const languages: string[] = ['swahili', 'french', 'japanese', 'spanish']
  for (let i = 0; i < 4; ++i) {
    let createdChatGroup: IChatGroupSubset = {
      language: languages[i]
    }
    if (i == 0) createdChatGroup.name = "Mama Alice's Gang"
    if (i == 3) createdChatGroup.name = 'Vamos a la playa'
    chatGroupsArray.push(createdChatGroup)
  }
  return getRepository(ChatGroup).save(chatGroupsArray)
}

const createUserLanguages = (users: User[]): Promise<UserLanguage[]> => {
  let userLanguagesArray: IUserLanguageSubset[] = []
  const languages: string[][] = [
    ['english', 'swahili', 'spanish', 'french'],
    ['french', 'swahili', 'mandarin', 'japanese'],
    ['japanese', 'turkish', 'spanish', 'swahili']
  ]
  for (let i = 0; i < users.length; ++i) {
    const currentUser: User = users[i]
    for (let j = 0; j < 4; j++) {
      let createdUserLanguage: IUserLanguageSubset = {
        type: j <= 2 ? 'learner' : 'teacher',
        language: languages[i][j],
        user: currentUser
      }
      if (Math.random() <= 0.5) {
        createdUserLanguage.numberOfYears = 1
      }
      userLanguagesArray.push(createdUserLanguage)
    }
  }
  const repository: Repository<UserLanguage> = getRepository(UserLanguage)
  return repository.save(userLanguagesArray)
}

const createUserChatGroups = (
  users: User[],
  chatGroups: ChatGroup[]
): Promise<UserChatGroup[]> => {
  const [joe, kim, mike] = users
  const [swahili, french, japanese, spanish] = chatGroups

  const userChatGroupsCG: ChatGroup[] = [
    swahili,
    swahili,
    swahili,
    french,
    french,
    japanese,
    japanese,
    spanish,
    spanish
  ]
  const userChatGroupsUser: User[] = [
    joe,
    kim,
    mike,
    joe,
    kim,
    kim,
    mike,
    joe,
    mike
  ]
  let userChatGroupsArray: IUserChatGroupSubset[] = []
  for (let i = 0; i < userChatGroupsCG.length; ++i) {
    const createdUserChatGroup: IUserChatGroupSubset = {
      user: userChatGroupsUser[i],
      chatGroup: userChatGroupsCG[i]
    }
    userChatGroupsArray.push(createdUserChatGroup)
  }
  return getRepository(UserChatGroup).save(userChatGroupsArray)
}

const createMessages = (
  userChatGroups: UserChatGroup[]
): Promise<Message[]> => {
  const messages: IMessageSubset[] = []
  for (let i = 0; i < userChatGroups.length; ++i) {
    messages.push({
      body: 'this is the best app ever :)',
      userChatGroup: userChatGroups[i]
    })
  }

  return getRepository(Message).save(messages)
}

const refreshDBWithSeedData = async (): Promise<void> => {
  try {
    await dbInit(true)
    const [users, chatGroups]: [User[], ChatGroup[]] = await Promise.all([
      createUsers(),
      createChatGroups()
    ])
    const userChatGroups: UserChatGroup[] = await createUserChatGroups(
      users,
      chatGroups
    )
    await Promise.all([
      createUserLanguages(users),
      createMessages(userChatGroups)
    ])
    console.log('database successfully refreshed with seed data')
  } catch (err) {
    console.log('seeding of data failed')
    console.error(err)
  }
}

export default refreshDBWithSeedData
