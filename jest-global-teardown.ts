export default async () => {
  await global.__POSTGRES__.close()
  console.log(global.__POSTGRES__.isConnected)
}
