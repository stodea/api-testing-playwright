import { test, expect } from '@playwright/test'

test.describe.parallel('API Testing', () => {
  const baseUrl = 'https://reqres.in/api'

  test('Simple API Test - Assert Response Status', async ({ request }) => {
    const response = await request.get(`${baseUrl}/users/2`)

    expect(response.status()).toBe(200)
  })

  test('Simple API Test - Assert Invalid Endpoint', async ({ request }) => {
    const response = await request.get(`${baseUrl}/users/non-existing-endpoint`)

    expect(response.status()).toBe(404)
  })

  test('GET Request - Get User Detail', async ({ request }) => {
    const response = await request.get(`${baseUrl}/users/1`)
    const responseBody = JSON.parse(await response.text())

    expect(response.status()).toBe(200)
    expect(responseBody.data.id).toBe(1)
    expect(responseBody.data.first_name).toBe('George')
    expect(responseBody.data.last_name).toBe('Bluth')
    expect(responseBody.data.email).toBeTruthy()
  })

  test('POST Request - Create new User', async ({ request }) => {
    const response = await request.post(`${baseUrl}/user`, {
      data: {
        id: 1000,
      },
    })
    const responseBody = JSON.parse(await response.text())

    expect(response.status()).toBe(201)
    expect(responseBody.id).toBe(1000)
    expect(responseBody.createdAt).toBeTruthy
  })

  test('POST Request - Login', async ({ request }) => {
    const response = await request.post(`${baseUrl}/login`, {
      data: {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka',
      },
    })
    const responseBody = JSON.parse(await response.text())

    expect(response.status()).toBe(200)
    expect(responseBody.token).toBeTruthy
  })

  test('POST Request - Login Fail', async ({ request }) => {
    const response = await request.post(`${baseUrl}/login`, {
      data: {
        email: 'eve.holt@reqres.in',
      },
    })
    const responseBody = JSON.parse(await response.text())

    expect(response.status()).toBe(400)
    expect(responseBody.error).toBe('Missing password')
  })

  test('PUT Request - Update User', async ({ request }) => {
    const response = await request.put(`${baseUrl}/users/2`, {
      data: {
        name: 'new name',
        job: 'new job',        
      },
    })
    const responseBody = JSON.parse(await response.text())

    expect(response.status()).toBe(200)
    expect(responseBody.name).toBe('new name')
    expect(responseBody.job).toBe('new job')
    expect(responseBody.updateAt).toBeTruthy
  })

  test('DELETE Request - Delete User', async ({ request }) => {
    const response = await request.delete(`${baseUrl}/users/2`)    

    expect(response.status()).toBe(204)
  })
})
