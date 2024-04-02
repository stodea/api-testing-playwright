import { test, expect } from '@playwright/test'
import tags from '../test-data/conduit/tags.json'

test.describe.parallel('API Auth Testing', () => {
  const appBaseUrl = 'https://conduit.bondaracademy.com'
  const apiBaseUrl = 'https://conduit-api.bondaracademy.com/api'

  test.beforeEach(async ({ page }) => {
    await page.route('*/**/api/tags', async (route) => {
      await route.fulfill({
        body: JSON.stringify(tags),
      })
    })

    await page.goto(appBaseUrl)    
  })

  test('Has title', async ({ page }) => {
    await page.route('*/**/api/articles*', async (route) => {
      const response = await route.fetch()
      const responseBody = await response.json()
      responseBody.articles[0].title = 'This is a MOCK test title'
      responseBody.articles[0].description = 'This is a MOCK test description'    

      await route.fulfill({
        body: JSON.stringify(responseBody)
      })
    })

    await expect(page.locator('.navbar-brand')).toHaveText('conduit')
    await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title')
    await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK test description')
    await page.waitForTimeout(2000)
  })

  test('Delete article', async ({page, request }) => {
    const articleResponse = await request.post(`${apiBaseUrl}/articles`, {
      data:{
        'article':{'taglist':[],'title':'This is a test title','description':'This is a test description','body':'This is a test body'}
      }
    })
    expect(articleResponse.status()).toBe(201)

    await page.getByText('Global Feed').click()
    await page.getByText('This is a test title').click()
    await page.getByRole('button', {name:'Delete Article'}).first().click()
    await page.getByText('Global Feed').click()

    await expect(page.locator('app-article-list h1').first()).not.toContainText('This is a test title')
  })

  test('Create article', async ({page, request }) => {
    await page.getByText('New Article').click()
    await page.getByRole('textbox', {name: 'Article Title'}).fill("New test article title")
    await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill("New test about article")
    await page.getByRole('textbox', {name: 'Write your article (in markdown)'}).fill("New test article description")    
    await page.getByRole('button', {name:'Publish Article'}).click() 
    const articleResponse = await page.waitForResponse(`${apiBaseUrl}/articles/`)   
    const articleResponseBody = await articleResponse.json()
    const slugId = articleResponseBody.article.slug
    
    await expect(page.locator('.article-page h1').first()).toContainText('New test article title')
    await page.getByText('Home').click()
    await page.getByText('Global Feed').click()

    await expect(page.locator('app-article-list h1').first()).toContainText('New test article title')
  
    const deleteArticleResponse = await request.delete(`${apiBaseUrl}/articles/${slugId}`)
    expect(deleteArticleResponse.status()).toBe(204)
  })


})

