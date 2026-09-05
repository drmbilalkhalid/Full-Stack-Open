const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'bill',
        name: 'Bilal',
        password: 'bills',
      },
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'bill', 'bills')
      await expect(page.getByText('Bilal logged in')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'bill', 'wrong')
      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'bill', 'bills')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'testBlog', 'tester', 'www.playwright.com')
      await expect(page.getByText('testBlog tester')).toBeVisible()
      await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
    })

    describe('when blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          'The real test is tests',
          'tester',
          'www.fullstackopen.com/en',
        )
        await createBlog(page, 'test blog 2', 'rogue', 'www.anything.com/rouge')
      })
      test('blog can be liked', async ({ page }) => {
        await page
          .getByText('The real test is tests')
          .getByRole('button', { name: 'view' })
          .click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes: 1')).toBeVisible()
      })
    })
  })

  describe('multiple users', () => {
    beforeEach(async ({ page, request }) => {
      await request.post('/api/users', {
        data: {
          username: 'user2',
          name: 'Multi',
          password: 'user2pass',
        },
      })
      await loginWith(page, 'bill', 'bills')
      await createBlog(page, 'testBlog', 'tester', 'www.anything.com/tester')
      await createBlog(page, 'test blog 2', 'master', 'www.anything.com/master')
      await page.getByRole('button', { name: 'logout' }).click()

      await loginWith(page, 'user2', 'user2pass')
      await createBlog(page, 'test blog 3', 'user2', 'www.anything.com/user2')
    })

    test('user who added the blog can delete the blog', async ({ page }) => {
      await page
        .getByText('test blog 3')
        .getByRole('button', { name: 'view' })
        .click()
      page.once('dialog', async (dialog) => {
        await dialog.accept()
      })
      await page.getByRole('button', { name: 'delete' }).click()
      await expect(page.getByText('www.anything.com/user2')).not.toBeVisible()
    })

    test('user who added the blog only see the blog delete button', async ({
      page,
    }) => {
      await page
        .getByText('testBlog')
        .getByRole('button', { name: 'view' })
        .click()
      await expect(
        page.getByRole('button', { name: 'delete' }),
      ).not.toBeVisible()
      await page.getByRole('button', { name: 'hide' }).click()

      await page
        .getByText('test blog 3')
        .getByRole('button', { name: 'view' })
        .click()
      await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()
    })

    test('blog list is in descending order accourding to the likes', async ({
      page,
    }) => {
      await page
        .getByText('testBlog tester')
        .getByRole('button', { name: 'view' })
        .click()
      await page
        .getByText('test blog 2 master')
        .getByRole('button', { name: 'view' })
        .click()
      await page
        .getByText('test blog 3 user2')
        .getByRole('button', { name: 'view' })
        .click()

      const blog1 = await page
        .getByText('testBlog hidewww.anything.com')
        .getByRole('button', { name: 'like' })
      const blog2 = await page
        .getByText('test blog 2 hidewww.anything.')
        .getByRole('button', { name: 'like' })
      const blog3 = await page
        .getByText('test blog 3 hidewww.anything.')
        .getByRole('button', { name: 'like' })

      await blog2.click()
      await blog2.click()
      await blog2.click()
      await blog3.click()
      await blog3.click()

      await expect(page.locator('.likes')).toHaveText([
        /\b3\b/,
        /\b2\b/,
        /\b0\b/,
      ])
    })
  })
})
