# Prerequisites

Node.js (v14 or higher)
npm or yarn package manager

# Installation

Clone the repository:

```
git clone [<repository-url>](https://github.com/benWozak/cm-a2z-takehome.git)
cd cm-a2z-takehome
```
Install dependencies:

```
npm install
```
or
```
yarn install
```

# Development
To start the development server:
```
npm run dev
```
or
```
yarn dev
```

The application will be available at http://localhost:5173

# Building for Production

To create a production build:
```
npm run build
```
or
```
yarn build
```

To preview the production build:
```
npm run preview
```
or
```
yarn preview
```

# Tech Stack

TypeScript - Type-safe JavaScript
Vite - Next Generation Frontend Tooling
DayJS - Lightweight date library
Sass - CSS preprocessor

Project Structure

```
src/
├── api/
│   └── navigation.json     # City navigation data
├── services/
│   ├── main.ts            # Application entry point
│   ├── navigation.ts      # Navigation setup and logic
│   └── time.ts            # Time display logic
├── styles/
│   ├── _layout.scss       # Global layout styles
│   ├── _navigation.scss   # Navigation component styles
│   ├── _time.scss        # Clock display styles
│   ├── _variables.scss   # Sass variables
│   └── index.scss        # Main stylesheet
└── vite-env.d.ts         # TypeScript declarations
```


# Browser Support
The application supports all modern browsers including:

```
Chrome (latest)
Firefox (latest)
Safari (latest)
Edge (latest)
```

# License
This project is licensed under the MIT License - see the LICENSE file for details
