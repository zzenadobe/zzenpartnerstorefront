/**
 * ADOBE CONFIDENTIAL
 * __________________
 * Copyright 2023 Adobe
 * All Rights Reserved.
 * __________________
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 */
export declare const PRODUCT_OPTION_FRAGMENT = "\nfragment PRODUCT_OPTION_FRAGMENT on ProductViewOption {\n    id\n    title\n    required\n    multi\n    values {\n      id\n      title\n      inStock\n      __typename\n      ... on ProductViewOptionValueProduct {\n        title\n        quantity\n        isDefault\n        __typename\n        product {\n          sku\n          shortDescription\n          metaDescription\n          metaKeyword\n          metaTitle\n          name\n          price {\n            final {\n              amount {\n                value\n                currency\n              }\n            }\n            regular {\n              amount {\n                value\n                currency\n              }\n            }\n            roles\n          }\n        }\n      }\n      ... on ProductViewOptionValueSwatch {\n        id\n        title\n        type\n        value\n        inStock\n      }\n    }\n  }\n";
//# sourceMappingURL=ProductOptionFragment.graphql.d.ts.map