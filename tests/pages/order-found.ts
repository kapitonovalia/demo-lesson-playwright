import { BasePage } from './base-page'
import { expect, Locator, Page } from '@playwright/test'
import { Input } from '../atoms/Input'

export class orderFoundPage extends BasePage {
  readonly orderDetailsPage: Locator
  readonly uselessInput: Input
  readonly orderStatus: Locator
  readonly orderNameTitle: Locator
  readonly orderPhoneTitle: Locator
  readonly orderCommentTitle: Locator
  readonly orderStatusDescr: Locator

  constructor(page: Page) {
    super(page)
    this.orderDetailsPage = page.locator('.order-details-page')
    this.uselessInput = new Input(page, '[data-name="useless-input"]')
    this.orderNameTitle = this.page.locator('.order-list__title', { hasText: 'Name' })
    this.orderPhoneTitle = this.page.locator('.order-list__title', { hasText: 'Phone' })
    this.orderCommentTitle = this.page.locator('.order-list__title', { hasText: 'Comment' })
    this.orderStatus = page.locator('[class="status-list__status status-list__status_active"]')
    this.orderStatusDescr = this.page.locator(
      '[class="status-list__description status-list__description_active"]',
    )
  }

  async checkOrderStatus(): Promise<void> {
    await expect(this.orderStatus).toBeVisible()
    await expect(this.orderStatus).toHaveText('OPEN')
  }

  async checkStatusDescription(): Promise<void> {
    await expect(this.orderStatusDescr).toBeVisible()
    await expect(this.orderStatusDescr).toHaveText('Order has been created')
  }
}
