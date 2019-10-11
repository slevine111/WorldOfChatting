export interface IUserPostDTO {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface IUserUpdateDTO {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  loggedIn?: boolean
}
