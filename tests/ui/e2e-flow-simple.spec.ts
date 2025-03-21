import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { faker } from '@faker-js/faker/locale/ar'
import { PASSWORD, USERNAME } from '../../config/env-data'
import { OrderNotFoundPage } from '../pages/order-not-found'
import { orderFoundPage } from '../pages/order-found'

test.describe('Tests', async () => {
  test('signIn button disabled when incorrect data inserted', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()
    await loginPage.usernameField.fill(faker.lorem.word(2))
    await loginPage.passwordField.fill(faker.lorem.word(7))
    await loginPage.signInButton.checkVisible()
    await loginPage.signInButton.checkDisabled(true)
  })

  test('login with correct credentials and verify order creation page', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()
    const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
    await orderCreationPage.statusButton.checkDisabled(false)
    await orderCreationPage.nameField.checkVisible()
  })
  test('TL-18-1 Check footer on login page', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()
    //await loginPage.checkFooterVisible()
    await loginPage.checkFooterAttached()
    await loginPage.langButtonRu.checkVisible()
    await loginPage.landButtonEn.checkVisible()
    await loginPage.privacyPolicyLink.checkVisible()
    await loginPage.cookiePolicyLink.checkVisible()
    await loginPage.tosLink.checkVisible()
  })

  test('TL-18-2 Check footer on order page', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()
    const orderPage = await loginPage.signIn(USERNAME, PASSWORD)
    await orderPage.checkFooterAttached()
    await orderPage.langButtonRu.checkVisible()
    await orderPage.landButtonEn.checkVisible()
    await orderPage.privacyPolicyLink.checkVisible()
    await orderPage.cookiePolicyLink.checkVisible()
    await orderPage.tosLink.checkVisible()
  })

  test('TL-18-3 Check footer on order not found page', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const notFoundPage = new OrderNotFoundPage(page)
    await loginPage.open()
    const orderPage = await loginPage.signIn(USERNAME, PASSWORD)
    await orderPage.statusButton.click()
    await orderPage.orderNumberField.fill('123456')
    await orderPage.trackButton.click()
    await notFoundPage.checkNotFoundTitle()
    await notFoundPage.checkFooterAttached()
    await notFoundPage.langButtonRu.checkVisible()
    await notFoundPage.landButtonEn.checkVisible()
    await notFoundPage.privacyPolicyLink.checkVisible()
    await notFoundPage.cookiePolicyLink.checkVisible()
    await notFoundPage.tosLink.checkVisible()
  })

  test('TL-18-4 Verification of order creation', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()
    const orderPage = await loginPage.signIn(USERNAME, PASSWORD)
    await orderPage.nameField.fill(faker.internet.username())
    await orderPage.phoneField.fill(faker.phone.number())
    await orderPage.commentField.fill(faker.word.words())
    await orderPage.createOrderButton.click()
    await orderPage.checkCreatedTitle()
    await orderPage.checkTrackCodeText()
    await page.waitForTimeout(5000)
    const trackingId = await orderPage.getTrackingId()
    expect(trackingId).toMatch(/^\d{4}$/)
    console.log('Extracted Tracking Number:', trackingId)
    await orderPage.orderButtonOk.click()
    await orderPage.statusButton.click()
    await orderPage.orderNumberField.pressSequentially(trackingId)
    await orderPage.submit.click()
  })

  test.only('TL-18-5 Tracking order and check status page', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()
    const orderPage = await loginPage.signIn(USERNAME, PASSWORD)
    await orderPage.statusButton.click()
    await orderPage.orderNumberField.fill('6390')
    await orderPage.submit.click()
    const statusPage = new orderFoundPage(page)
    await statusPage.checkOrderStatus
    await statusPage.checkStatusDescription()
  })
})
