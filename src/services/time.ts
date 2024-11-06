import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface TimeZoneMapping {
  [key: string]: string;
}

interface GreetMapping {
  [key: string]: string;
}

const cityTimeZones: TimeZoneMapping = {
  'cupertino': 'America/Los_Angeles',
  'new-york-city': 'America/New_York',
  'london': 'Europe/London',
  'amsterdam': 'Europe/Amsterdam',
  'tokyo': 'Asia/Tokyo',
  'hong-kong': 'Asia/Hong_Kong',
  'sydney': 'Australia/Sydney'
};

const greetings: GreetMapping = {
  'cupertino': 'What&apos;s up my dude',
  'new-york-city': 'Hello there',
  'london': 'Great day, innit',
  'amsterdam': 'Hoe gaat het!',
  'tokyo': 'こんにちは',
  'hong-kong': '你好',
  'sydney': 'G&apos;day mate!'
};

export async function setupTimeDisplay(clockElement: HTMLElement) {
  let currentCity = 'cupertino'; // default city
  let updateInterval: number | null = null;

  function updateTime() {
    if (updateInterval) {
      clearInterval(updateInterval);
    }

    const updateDisplay = () => {
      const timeZone = cityTimeZones[currentCity];
      const time = dayjs().tz(timeZone);
      
      clockElement.innerHTML = `
        <div class="time">
          <h2>${greetings[currentCity]} <span class="waving-hand">👋</span> </h2>
          <div class="current-time">${time.format('h:mm:ss A')}</div>
          <div class="current-day">${time.format('dddd MMMM DD')}</div>
        </div>
      `;
    };

    updateDisplay();
    updateInterval = window.setInterval(updateDisplay, 1000);
  }

  function updateCityFromUrl() {
    const path = window.location.pathname.replace('/', '');
    if (path && cityTimeZones[path]) {
      currentCity = path;
      updateTime();
    }
  }

  try {
    const navElement = document.querySelector('.main-nav-items');
    if (navElement) {
      navElement.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('nav-item-link')) {
          const href = target.getAttribute('href');
          if (href) {
            currentCity = href.replace('/', '');
            updateTime();
          }
        }
      });
    }

    window.addEventListener('popstate', () => {
      updateCityFromUrl();
    });

    updateCityFromUrl();

  } catch (error) {
    console.error('Error setting up time display:', error);
    clockElement.innerHTML = '<div class="time">Error loading time display</div>';
  }
}