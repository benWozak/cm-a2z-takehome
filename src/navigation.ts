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
      
      a.href = `${city.section}`;
      a.textContent = city.label;
      
      li.className = 'nav-item';
      a.className = 'nav-item-link';

      const isActive = window.location.pathname.includes(city.section);

      if(isActive) {
        a.classList.add('active')

        requestAnimationFrame(() => {
          console.log('do the thing: ' + city.section )
        })
      }

      a.setAttribute('role', 'menuitem')
      
      li.appendChild(a);
      navElement.appendChild(li);
    });

    const slidingIndicator = document.createElement('div');
    slidingIndicator.className = 'sliding-indicator';
    navElement.appendChild(slidingIndicator);

    const links = navElement.querySelectorAll('.nav-item-link')

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        links.forEach(item => item.classList.remove('active'))
        link.classList.add('active');

        updateIndicator(link as HTMLAnchorElement)

        // update url without full page refresh
        const href = link.getAttribute('href')
        if(!!href) {
          window.history.pushState(null, '', href)
        }

      })
    })
    
  } catch (error) {
    console.error('Error setting up navigation:', error);
    navElement.innerHTML = '<li>Error loading navigation</li>';
  }
}

function updateIndicator(activeLink: HTMLAnchorElement) {
  const indicator = document.querySelector('.sliding-indicator') as HTMLElement;

  if(!indicator) return

  const linkEl = activeLink.getBoundingClientRect();
  const navEl = activeLink.closest('.main-nav-items')?.getBoundingClientRect();

  if(!!navEl) {
    const width = linkEl.width
    const left = linkEl.left - navEl.left;

    indicator.style.width = `${width}px`;
    indicator.style.transform = `translateX(${left}px)`;
  }
}