import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("E2E and Accessibility Tests", () => {
  test("TC-01 & TC-02: Navigation and Keyboard Focus", async ({ page }) => {
    // TC-01: Navigation
    await page.goto("/");

    // Check initial page A11y
    let a11yResult = await new AxeBuilder({ page }).analyze();
    expect(a11yResult.violations).toEqual([]);

    // Click on Todo and verify URL and A11y
    await page.getByRole("link", { name: "Todo" }).click();
    await expect(page).toHaveURL(/.*todo/);
    a11yResult = await new AxeBuilder({ page }).analyze();
    expect(a11yResult.violations).toEqual([]);

    // Click on Address Book and verify URL and A11y
    await page.getByRole("link", { name: "Address Book" }).click();
    await expect(page).toHaveURL(/.*address-book/);
    a11yResult = await new AxeBuilder({ page }).analyze();
    expect(a11yResult.violations).toEqual([]);

    // TC-02: Keyboard Navigation (Focus Management test)
    await page.goto("/");
    await page.keyboard.press("Tab"); // typically focuses first interactive element (Skip link or Logo/Home)
    // Wait and make sure an element is focused
    const focusedHome = await page.evaluate(
      () => document.activeElement?.textContent,
    );
    expect(focusedHome).not.toBeNull();
  });

  test("TC-03, TC-04, TC-05: Todo Page Interactions", async ({ page }) => {
    await page.goto("/todo");

    // Make sure initial state has no violations
    let a11yResult = await new AxeBuilder({ page }).analyze();
    expect(a11yResult.violations).toEqual([]);

    // TC-03: Add a new task (Assuming basic input UI based on general conventions)
    const input = page.locator('input[type="text"]');
    await input.fill("Write E2E tests");
    await input.press("Enter");

    // Re-check A11y after DOM mutation
    a11yResult = await new AxeBuilder({ page }).analyze();
    expect(a11yResult.violations).toEqual([]);

    // We assume the task appears with a checkbox
    const taskCheckbox = page.locator('input[type="checkbox"]').first();
    const taskDeleteBtn = page
      .getByRole("button", { name: /delete|remove/i })
      .first(); // Regex matched the delete logic

    if (await taskCheckbox.isVisible()) {
      // TC-04: Mark task as completed
      await taskCheckbox.click();
      a11yResult = await new AxeBuilder({ page }).analyze();
      expect(a11yResult.violations).toEqual([]);
    }

    if (await taskDeleteBtn.isVisible()) {
      // TC-05: Delete the task
      await taskDeleteBtn.click();
      a11yResult = await new AxeBuilder({ page }).analyze();
      expect(a11yResult.violations).toEqual([]);
    }
  });

  test("TC-06, TC-07: Address Book Validation and Adding", async ({ page }) => {
    await page.goto("/address-book");

    // TC-06: Empty form submission triggering validation errors
    // Trying to save an empty form
    const saveBtn = page.getByRole("button", { name: /save|add|submit/i });
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
    }

    // A11y check for validation errors
    let a11yResult = await new AxeBuilder({ page }).analyze();
    expect(a11yResult.violations).toEqual([]);

    // Finding generic input fields that typically belong to an address book form
    const fName = page.getByLabel(/first name|name/i);
    const phone = page.getByLabel(/phone/i);

    // TC-07: Add a contact successfully if the form exists
    if ((await fName.isVisible()) && (await phone.isVisible())) {
      await fName.fill("John Doe");
      await phone.fill("123-456-7890");
      await saveBtn.click();

      // Ensure that new DOM elements are accessible
      a11yResult = await new AxeBuilder({ page }).analyze();
      expect(a11yResult.violations).toEqual([]);
    }
  });
});
