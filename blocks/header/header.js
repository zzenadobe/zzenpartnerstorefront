/* eslint-disable import/no-unresolved */

// Drop-in Tools
import { events } from '@dropins/tools/event-bus.js';
// Cart dropin
import { publishShoppingCartViewEvent } from '@dropins/storefront-cart/api.js';

// Auth Dropin
import * as authApi from '@dropins/storefront-auth/api.js';
import { render as authRenderer } from '@dropins/storefront-auth/render.js';
import AuthCombine from '@dropins/storefront-auth/containers/AuthCombine.js';

import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// Block-level
import createModal from '../modal/modal.js';
import { getCookie } from '../../scripts/configs.js';

// Container and component references
let modal;

// Dynamic containers and components
const showModal = async (content) => {
  modal = await createModal([content]);
  modal.showModal();
};

const removeModal = () => {
  if (!modal) return;
  modal.removeModal();
  modal = null;
};

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]',
    );
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]',
    );
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });

  const expandedItems = sections.querySelectorAll('.expanded');
  if (expandedItems) {
    [...expandedItems].map((e) => e.classList.remove('expanded'));
  }
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(
    navSections,
    expanded || isDesktop.matches ? 'false' : 'true',
  );
  button.setAttribute(
    'aria-label',
    expanded ? 'Open navigation' : 'Close navigation',
  );
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';

  const nav = document.createElement('nav');
  nav.id = 'nav';

  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];

  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (!section) {
      const newSection = document.createElement('div');
      newSection.classList.add(`nav-${c}`);
      if (i === 0) {
        nav.appendChild(newSection);
      } else {
        const prevSection = nav.children[i - 1];
        prevSection.insertAdjacentElement('afterend', newSection);
      }
    } else {
      section.classList.add(`nav-${c}`);
    }
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandImage = navBrand.querySelector('picture');

  if (brandImage) {
    const section = brandImage.closest('.section');
    if (section) {
      const anchor = document.createElement('a');
      anchor.href = '/';
      section.parentNode.insertBefore(anchor, section);
      anchor.appendChild(section);
    }
  }

  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  const dataPromise = await window.categoryData;
  const data = dataPromise?.data?.categories?.items;

  if (navSections) {
    const navSectionsUlWrapper = document.createElement('div');
    navSectionsUlWrapper.className = 'nav-sections-ul-wrapper';

    [...data].reverse().map((ele) => {
      const categoryUl = document.createElement('ul');
      const categoryUlLi = document.createElement('li');
      const categoryLink = document.createElement('a');

      categoryLink.href = `${window.location.origin}/${ele.url}`;

      if (window.location.pathname === `/${ele.url}`) {
        categoryLink.classList.add('selected');
      }
      categoryLink.textContent = ele.name;
      const categoryAccordian = document.createElement('a');

      categoryAccordian.className = 'accordian-icon';
      categoryLink.append(categoryAccordian);

      function toggleListItem(e) {
        if (!isDesktop.matches) {
          e.preventDefault();
          categoryUlLi.classList.toggle('expanded');
        }
      }

      categoryAccordian.addEventListener('click', (e) => {
        toggleListItem(e);
      });

      categoryUlLi.append(categoryLink);

      if (ele.children.length > 0) {
        const subCategoryUl = document.createElement('ul');
        const subCategories = ele.children;

        [...subCategories].map((e) => {
          const subCategoryUlLi = document.createElement('li');
          const subCategoryLink = document.createElement('a');

          subCategoryLink.href = `${window.location.origin}/${e.url}`;
          subCategoryLink.textContent = e.name;
          subCategoryUlLi.append(subCategoryLink);
          subCategoryUl.append(subCategoryUlLi);

          return subCategoryUlLi;
        });

        categoryUlLi.append(subCategoryUl);
      }

      categoryUl.append(categoryUlLi);
      navSectionsUlWrapper.prepend(categoryUl);
      return categoryUl;
    });

    navSections.prepend(navSectionsUlWrapper);
    navSections
      .querySelectorAll(':scope .nav-sections-ul-wrapper > ul > li')
      .forEach((navSection) => {
        if (navSection.querySelector('ul')) {
          navSection.classList.add('nav-drop');
        }

        navSection.addEventListener('click', () => {
          if (isDesktop.matches) {
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSections);
            navSection.setAttribute(
              'aria-expanded',
              expanded ? 'false' : 'true',
            );
          }
        });
      });
  }

  const navTools = nav.querySelector('.nav-tools');

  const search = document.createRange().createContextualFragment(`
    <div class="search-wrapper nav-tools-wrapper">
      <button type="button" class="nav-search-button">Search</button>
      <div class="nav-search-input nav-search-panel nav-tools-panel">
        <form action="/search" method="GET">
          <input id="search" type="search" name="q" placeholder="Search" />
          <div id="search_autocomplete" class="search-autocomplete"></div>
        </form>
      </div>
    </div>
    `);

  navTools.append(search);

  const searchPanel = navTools.querySelector('.nav-search-panel');

  const searchButton = navTools.querySelector('.nav-search-button');

  const searchInput = searchPanel.querySelector('input');

  async function toggleSearch(state) {
    const show = state ?? !searchPanel.classList.contains('nav-tools-panel--show');

    searchPanel.classList.toggle('nav-tools-panel--show', show);

    if (show) {
      await import('./searchbar.js');
      searchInput.focus();
    }
  }

  navTools
    .querySelector('.nav-search-button')
    .addEventListener('click', () => toggleSearch());

  /** Mini Cart */
  const excludeMiniCartFromPaths = ['/checkout'];

  const minicart = document.createRange().createContextualFragment(`
     <div class="minicart-wrapper nav-tools-wrapper">
       <button type="button" class="nav-cart-button" aria-label="Cart"></button>
       <div class="minicart-panel nav-tools-panel"></div>
     </div>
   `);

  navTools.append(minicart);

  const minicartPanel = navTools.querySelector('.minicart-panel');

  const cartButton = navTools.querySelector('.nav-cart-button');

  if (excludeMiniCartFromPaths.includes(window.location.pathname)) {
    cartButton.style.display = 'none';
  }

  // load nav as fragment
  const miniCartMeta = getMetadata('mini-cart');
  const miniCartPath = miniCartMeta
    ? new URL(miniCartMeta, window.location).pathname
    : '/mini-cart';
  loadFragment(miniCartPath).then((miniCartFragment) => {
    minicartPanel.append(miniCartFragment.firstElementChild);
  });

  async function toggleMiniCart(state) {
    const show = state ?? !minicartPanel.classList.contains('nav-tools-panel--show');
    const stateChanged = show !== minicartPanel.classList.contains('nav-tools-panel--show');
    minicartPanel.classList.toggle('nav-tools-panel--show', show);

    if (stateChanged && show) {
      publishShoppingCartViewEvent();
    }
  }

  cartButton.addEventListener('click', () => toggleMiniCart());

  // Cart Item Counter
  events.on(
    'cart/data',
    (cartData) => {
      if (cartData?.totalQuantity) {
        cartButton.setAttribute('data-count', cartData.totalQuantity);
      } else {
        cartButton.setAttribute('data-count', 0);
      }
    },
    { eager: true },
  );

  // Close panels when clicking outside
  document.addEventListener('click', (e) => {
    if (!minicartPanel.contains(e.target) && !cartButton.contains(e.target)) {
      toggleMiniCart(false);
    }

    if (!searchPanel.contains(e.target) && !searchButton.contains(e.target)) {
      toggleSearch(false);
    }
  });

  /* User log in */
  const dropdownElement = document.createRange().createContextualFragment(`
     <div class="dropdown-wrapper nav-tools-wrapper">
        <button type="button" class="nav-dropdown-button" aria-haspopup="dialog" aria-expanded="false" aria-controls="login-modal"></button>
        <div class="nav-auth-menu-panel nav-tools-panel">
          <div id="auth-dropin-container"></div>
          <ul class="authenticated-user-menu">
             <li><a href="/customer/account">My Account</a></li>
              <li><button>Logout</button></li>
          </ul>
        </div>
     </div>`);

  navTools.append(dropdownElement);

  const authDropDownPanel = navTools.querySelector('.nav-auth-menu-panel');
  const authDropinContainer = navTools.querySelector('#auth-dropin-container');
  const loginButton = navTools.querySelector('.nav-dropdown-button');
  const logoutButton = navTools.querySelector(
    '.authenticated-user-menu > li > button',
  );

  // Initially hide the authDropDownMenuList
  authDropDownPanel.style.display = 'none';

  // Function to show the authDropDownMenuList
  function showAuthMenu() {
    authDropDownPanel.style.display = 'block';
    authDropinContainer.style.display = 'none';
  }

  // Function to hide the authDropDownMenuList
  function hideAuthMenu() {
    authDropDownPanel.style.display = 'none';
    authDropinContainer.style.display = 'block';
  }

  // Function to show the dropdown or modal based on authentication state
  async function showDropDownAuthModal(state) {
    const show = state ?? !authDropDownPanel.classList.contains('nav-tools-panel--show');

    if (show && !loginButton.classList.contains('authenticated')) {
      // Show modal for unauthenticated users
      const signInForm = document.createElement('div');
      authRenderer.render(AuthCombine, {
        signInFormConfig: {
          renderSignUpLink: true,
          onSuccessCallback: () => {},
        },
        resetPasswordFormConfig: {},
      })(signInForm);

      showModal(signInForm);
    } else if (loginButton.classList.contains('authenticated')) {
      // Show dropdown for authenticated users
      showAuthMenu();
    }
  }

  loginButton.addEventListener('click', () => showDropDownAuthModal());

  document.addEventListener('click', async (e) => {
    const clickOnDropDownPanel = authDropDownPanel.contains(e.target);
    const clickOnLoginButton = loginButton.contains(e.target);

    if (!clickOnDropDownPanel && !clickOnLoginButton) {
      hideAuthMenu();
    }
  });

  logoutButton.addEventListener('click', async () => {
    await authApi.revokeCustomerToken();
    window.location.href = '/';
  });

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  const updateDropDownUI = (isAuthenticated) => {
    const getUserTokenCookie = getCookie('auth_dropin_user_token');
    const getUserNameCookie = getCookie('auth_dropin_firstname');

    if (isAuthenticated || getUserTokenCookie) {
      loginButton.classList.add('authenticated');
      loginButton.textContent = `Hi, ${getUserNameCookie}`;
    } else {
      loginButton.classList.remove('authenticated');
      loginButton.innerHTML = `
      <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          aria-label="My Account"
          >
          <g fill="none" stroke="#000000" stroke-width="1.5">
            <circle cx="12" cy="6" r="4"></circle>
            <path d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z"></path>
          </g>
      </svg>`;
    }

    removeModal();
    hideAuthMenu();
  };

  events.on(
    'authenticated',
    (isAuthenticated) => {
      updateDropDownUI(isAuthenticated);
    },
    {
      eager: true,
    },
  );
}
