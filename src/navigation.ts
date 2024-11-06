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
      }

      a.setAttribute('role', 'menuitem')
      
      li.appendChild(a);
      navElement.appendChild(li);
    });

    
  } catch (error) {
    console.error('Error setting up navigation:', error);
    navElement.innerHTML = '<li>Error loading navigation</li>';
  }
}