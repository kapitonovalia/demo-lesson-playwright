import { BasePage } from './base-page'
import { expect, Locator, Page } from '@playwright/test'

export class OrderNotFoundPage extends BasePage {
  readonly notFindTitle: Locator

  constructor(page: Page) {
    super(page)
    this.notFindTitle = page.locator('h1.not-found__title')
  }

  async checkNotFoundTitle(): Promise<void> {
    await expect(this.notFindTitle).toBeVisible()
    await expect(this.notFindTitle).toHaveText('Order not found')
  }
}
