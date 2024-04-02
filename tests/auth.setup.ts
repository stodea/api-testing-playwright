import { test as setup } from '@playwright/test'
import user from '../.auth/user.json'
import fs from 'fs'

const apiBaseUrl = 'https://conduit-api.bondaracademy.com/api'
const authFile = '.auth/user.json'

setup('authentification', async ({ request }) => {
  const response = await request.post(`${apiBaseUrl}/users/login`, {
    data: {
      'user': {'email':'stefan.nicolae.todea@gmail.com','password':'qwertasdfg'}
    }
  })
  const responseBody = await response.json()
  const accessToken = responseBody.user.token    
  user.origins[0].localStorage[0].value = accessToken

  fs.writeFileSync(authFile, JSON.stringify(user))

  process.env['ACCESS_TOKEN'] = accessToken
})
