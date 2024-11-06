interface NavItem {
  section: string;
  label: string;
}

interface NavigationData {
  cities: NavItem[];
}

const WINDOW_WIDTH_BREAKPOINT = 1081;

export async function setupNavigation(navElement: HTMLUListElement) {
  try {
    const response = await fetch(new URL('../api/navigation.json', import.meta.url).href);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: NavigationData = await response.json();
    
    data.cities.forEach(city => {
      const li = document.createElement('li');
      const a = document.createElement('a');
     
      a.setAttribute('role', 'menuitem') 
      a.href = `/${city.section}`;
      a.textContent = city.label;
      
      li.className = 'nav-item';
      a.className = 'nav-item-link';

      // Check if current URL matches this nav item
      const isActive = window.location.pathname.includes(city.section);

      if(isActive) {
        a.classList.add('active')
      }
      
      li.appendChild(a);
      navElement.appendChild(li);
    });

    // Create sliding indicator
    const slidingIndicator = document.createElement('div');
    slidingIndicator.className = 'sliding-indicator';
    navElement.appendChild(slidingIndicator);

    // Initialize indicator for active item
    const activeLink = navElement.querySelector('.nav-item-link.active') as HTMLAnchorElement;
    if (activeLink) {
      updateIndicator(activeLink);
      slidingIndicator.style.opacity = '1';
    }

    const links = navElement.querySelectorAll('.nav-item-link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        // prevent page refresh when nav is clicked
        e.preventDefault();

        links.forEach(item => item.classList.remove('active'));
        link.classList.add('active');

        slidingIndicator.style.opacity = '1';
        updateIndicator(link as HTMLAnchorElement);

        // Update URL without triggering full refresh
        const href = link.getAttribute('href');
        if(href) {
          window.history.pushState(null, '', href);
        }
      });
    });

    let resizeTimeout: number;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        const currentActive = navElement.querySelector('.nav-item-link.active') as HTMLAnchorElement;
        if (currentActive) {
          updateIndicator(currentActive);
        }
      }, 100);
    });

    const navContainer = navElement.closest('.main-nav');
    if (navContainer) {
      if (window.innerWidth <= WINDOW_WIDTH_BREAKPOINT) {
        createScrollButtons(navContainer, navElement);
      }
      
      // Add/remove scroll buttons on resize
      let resizeTimeout: number;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(() => {
          const existingButtons = navContainer.querySelectorAll('.scroll-button');
          
          if (window.innerWidth <= WINDOW_WIDTH_BREAKPOINT && existingButtons.length === 0) {
            createScrollButtons(navContainer, navElement);
          } else if (window.innerWidth > WINDOW_WIDTH_BREAKPOINT && existingButtons.length > 0) {
            existingButtons.forEach(button => button.remove());
          }
          
          const currentActive = navElement.querySelector('.nav-item-link.active') as HTMLAnchorElement;
          if (currentActive) {
            updateIndicator(currentActive);
          }
        }, 100);
      });
    }
    
  } catch (error) {
    console.error('Error setting up navigation:', error);
    navElement.innerHTML = '<li>Error loading navigation</li>';
  }
}

function updateIndicator(activeLink: HTMLAnchorElement) {
  const indicator = document.querySelector('.sliding-indicator') as HTMLElement;
  if (!indicator) return;

  const listItem = activeLink.closest('.nav-item');
  if (!listItem) return;

  const linkEl = activeLink.getBoundingClientRect();
  const navEl = activeLink.closest('.main-nav-items');
  
  if (navEl) {
    const navRect = navEl.getBoundingClientRect();
    const containerLeft = navRect.left;
    const linkLeft = linkEl.left;
    
    indicator.style.width = `${linkEl.width}px`;
    
    if (window.innerWidth <= WINDOW_WIDTH_BREAKPOINT) {
      const scrollOffset = navEl.scrollLeft;
      indicator.style.transform = `translateX(${(linkLeft - containerLeft) + scrollOffset}px)`;
    } else {
      indicator.style.transform = `translateX(${linkLeft - containerLeft}px)`;
    }
  }
}

function createScrollButtons(navContainer: Element, navList: HTMLUListElement) {
  const leftButton = document.createElement('button');
  const rightButton = document.createElement('button');
  
  leftButton.className = 'scroll-button scroll-button--left hidden';
  rightButton.className = 'scroll-button scroll-button--right';
  
  leftButton.innerHTML = '←';
  rightButton.innerHTML = '→';
  
  leftButton.setAttribute('aria-label', 'Scroll left');
  rightButton.setAttribute('aria-label', 'Scroll right');

  navList.addEventListener('scroll', () => {
    updateScrollButtons();
    
    // Update indicator position when scrolling
    const currentActive = navList.querySelector('.nav-item-link.active') as HTMLAnchorElement;
    if (currentActive) {
      updateIndicator(currentActive);
    }
  });
  
  navContainer.appendChild(leftButton);
  navContainer.appendChild(rightButton);
  
  const scrollAmount = 200;
  
  leftButton.addEventListener('click', () => {
    navList.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  });
  
  rightButton.addEventListener('click', () => {
    navList.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  });
  
  // Update button visibility based on scroll position
  function updateScrollButtons() {
    const isAtStart = navList.scrollLeft <= 0;
    const isAtEnd = navList.scrollLeft >= navList.scrollWidth - navList.clientWidth - 1;
    
    leftButton.classList.toggle('hidden', isAtStart);
    rightButton.classList.toggle('hidden', isAtEnd);
  }
  
  navList.addEventListener('scroll', updateScrollButtons);
  window.addEventListener('resize', updateScrollButtons);
  
  updateScrollButtons();
}
