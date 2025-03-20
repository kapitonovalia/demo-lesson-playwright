import { expect, Locator, Page } from '@playwright/test'
import { Input } from '../atoms/Input'
import { Button } from '../atoms/Button'
import { BasePage } from './base-page'

export class OrderPage extends BasePage {
  //readonly page: Page
  readonly statusButton: Button
  readonly nameField: Input
  readonly phoneField: Input
  readonly commentField: Input
  readonly statusModal: Locator
  readonly orderNumberField: Input
  readonly trackButton: Button
  readonly createOrderButton: Button
  readonly createdModalPopup: Locator
  readonly orderCreatedTitle: Locator
  readonly trackNumberTitle: Locator
  readonly orderButtonOk: Button
  readonly notificationPopupText: Locator
  readonly submit: Button

  constructor(page: Page) {
    super(page)
    this.statusButton = new Button(page, '[data-name="openStatusPopup-button"]')
    this.nameField = new Input(page, '#name')
    this.phoneField = new Input(page, '#phone')
    this.commentField = new Input(page, '#comment')
    this.statusModal = page.getByTestId('searchOrder-popup')
    this.orderNumberField = new Input(page, '[data-name="searchOrder-popup"] input')
    this.trackButton = new Button(
      page,
      '[data-name="searchOrder-popup"] button.order-search-popup__button',
    )
    this.createOrderButton = new Button(page, '[data-name="createOrder-button"]')
    this.createdModalPopup = page.getByTestId('orderSuccessfullyCreated-popup-close-button')
    // this.orderCreatedModal = new Popup(page, '[data-name="orderSuccessfullyCreated-popup"]')
    this.orderCreatedTitle = page.locator('h3.notification-popup__text')
    this.trackNumberTitle = page.locator('span.notification-popup__text')
    this.orderButtonOk = new Button(page, '[data-name="orderSuccessfullyCreated-popup-ok-button"]')
    this.notificationPopupText = page.locator('span.notification-popup__text')
    this.submit = new Button(page, '[data-name="searchOrder-submitButton"]')
  }
  async checkCreatedTitle(): Promise<void> {
    await expect(this.orderCreatedTitle).toBeVisible()
    await expect(this.orderCreatedTitle).toHaveText('Order has been created!')
  }
  async checkTrackCodeText(): Promise<void> {
    await expect(this.trackNumberTitle).toBeVisible()
    await expect(this.trackNumberTitle).toContainText('Tracking code:')
  }
  async checkStatusCodeTitle(): Promise<void> {
    await expect(this.trackNumberTitle).toBeVisible()
    await expect(this.trackNumberTitle).toContainText('Enter the tracking code')
  }
  async getTrackingId(): Promise<string> {
    const innerText = await this.notificationPopupText.innerText()
    const id = innerText.match(/\d{4}/)
    if (id && id[0]) {
      return id[0]
    }
    throw new Error('Tracking number not found')
  }
}
