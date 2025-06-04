import {
  setGuestEmail,
  setGuestShippingAddress,
  setPaymentMethod,
  placeOrder,
} from '../../actions';
import {
  assertCartSummaryProduct,
  assertCartSummaryProductsOnCheckout,
  assertTitleHasLink,
  assertProductImage,
  assertCartSummaryMisc,
  assertOrderSummaryMisc,
  assertOrderConfirmationCommonDetails,
  assertOrderConfirmationShippingDetails,
  assertOrderConfirmationBillingDetails,
  assertOrderConfirmationShippingMethod,
} from '../../assertions';
import {
  assertSelectedPaymentMethod,
} from '../../assertions';
import {
  customerShippingAddress,
  paymentServicesCreditCard,
  checkMoneyOrder,
} from '../../fixtures/index';
import * as fields from "../../fields";

describe('Verify guest user can place order', () => {
  it('Verify guest user can place order', () => {
    cy.visit('');
    cy.get('.nav-drop')
      .contains('Catalog')
      .click();
    cy.wait(1000);
    cy.contains('Crown Summit Backpack').click();
    cy.get('.dropin-incrementer__increase-button').click();
    cy.get('.dropin-incrementer__input').should('have.value', '2');
    // cypress fails intermittently as it takes old value 1, this is needed for tests to be stable
    cy.wait(1000);
    cy.contains('Add to Cart').click();
    cy.get('.minicart-wrapper').click();
    assertCartSummaryProduct(
      'Crown Summit Backpack',
      '24-MB03',
      '2',
      '$38.00',
      '$76.00',
      '0'
    )('.cart-mini-cart');
    assertTitleHasLink(
      'Crown Summit Backpack',
      '/products/crown-summit-backpack/24-MB03'
    )('.cart-mini-cart');
    assertProductImage('/mb03-black-0.jpg')('.cart-mini-cart');
    cy.contains('View Cart').click();
    assertCartSummaryProduct(
      'Crown Summit Backpack',
      '24-MB03',
      '2',
      '$38.00',
      '$76.00',
      '0'
    )('.commerce-cart-wrapper');
    assertTitleHasLink(
      'Crown Summit Backpack',
      '/products/crown-summit-backpack/24-MB03'
    )('.commerce-cart-wrapper');
    assertProductImage('/mb03-black-0.jpg')('.commerce-cart-wrapper');
    cy.contains('Estimated Shipping').should('be.visible');
    cy.get('.dropin-button--primary')
      .contains('Checkout')
      .click();
    assertCartSummaryMisc(2);
    assertCartSummaryProductsOnCheckout(
      'Crown Summit Backpack',
      '24-MB03',
      '2',
      '$38.00',
      '$76.00',
      '0'
    );
    cy.contains('Estimated Shipping').should('be.visible')
    const apiMethod = 'setGuestEmailOnCart';
    const urlTest = Cypress.env('graphqlEndPoint');
    cy.intercept('POST', urlTest, (req) => {
      let data = req.body.query;
      if (data && typeof data == 'string') {
        if (data.includes(apiMethod)) {
          req.alias = 'setEmailOnCart';
        }
      }
    });
    setGuestEmail(customerShippingAddress.email);
    cy.wait('@setEmailOnCart');
    setGuestShippingAddress(customerShippingAddress, true);
    assertOrderSummaryMisc('$76.00', '$10.00', '$86.00');
    assertSelectedPaymentMethod(checkMoneyOrder.code, 0);
    setPaymentMethod(paymentServicesCreditCard);
    assertSelectedPaymentMethod(paymentServicesCreditCard.code, 1);
    cy.wait(5000);
    placeOrder();
    assertOrderConfirmationCommonDetails(customerShippingAddress, paymentServicesCreditCard);
    assertOrderConfirmationShippingDetails(customerShippingAddress);
    assertOrderConfirmationBillingDetails(customerShippingAddress);
    assertOrderConfirmationShippingMethod(customerShippingAddress);
    /**
     * TODO - when /order-details page will be ready
     * Redirect to /order-details?orderRef={ORDER_TOKEN}
     * Confirm that elements similar to orderConfirmation page present (not exactly the same, separate assert needed)
     */

    // Obtain order reference from URL and visit order details page

    cy.url().then((url) => {
      const orderRef = url.split('?')[1];
      cy.visit('/order-details?' + orderRef)
    })

    // CANCEL ORDER
    cy.get(fields.cancelButton).should('exist');
    cy.get(fields.cancelButton).click();

    cy.get(fields.cancellationReasonsSelector).select('1');
    cy.get(fields.cancellationReasonsSelector).should('have.value', '1');

    cy.get(fields.submitCancelOrderButton).click();

    cy.get('.dropin-header-container__title', {timeout: 3000})
      .should('exist')
      .and('be.visible')
      .and('contain.text', 'Cancellation requested');

    cy.get(fields.cancellationReasonsModal).should('not.exist');

    cy.get('.order-order-status-content__wrapper-description p')
      .should('exist')
      .and('be.visible')
      .and(
        'contain.text',
        'The cancellation has been requested'
      ).and(
      'contain.text',
      'Check your email for further instructions.'
    );
  });
});
