interface NavItem {
  section: string;
  label: string;
}

interface NavigationData {
  cities: NavItem[];
}

export async function setupNavigation(navElement: HTMLUListElement) {
  try {
    const response = await fetch('/src/api/navigation.json');
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
  const navEl = activeLink.closest('.main-nav-items')?.getBoundingClientRect();
  
  if (navEl) {
    const containerLeft = navEl.left;
    const linkLeft = linkEl.left;
    
    indicator.style.width = `${linkEl.width}px`;
    indicator.style.transform = `translateX(${linkLeft - containerLeft}px)`;
  }
}