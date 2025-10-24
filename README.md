# tranzit

tranzit is a logistics management dashboard built with React and Vite. It helps track trips, vehicles, invoices and other day‑to‑day operations for transport companies.

## Prerequisites

- Node.js 20.x (recommended)

## Installation

Install dependencies and start the development server:

```sh
npm install
npm run dev
```

The app runs on [http://localhost:3031](http://localhost:3031) by default.

## Build for production

```sh
npm run build
```

Preview the production build with:

```sh
npm start
```

## Environment variables

Create a `.env` file in the project root if you need to override default values:

```
VITE_SERVER_URL=<your API server URL>
VITE_ASSET_URL=<path for static assets>
VITE_BASE_PATH=<base path when deploying under a subfolder>
```

## Customisation

Update [`src/config-global.js`](src/config-global.js) to change company information, invoice tax rates and other settings.

---

This project uses Material UI and integrates with service workers for optional PWA support.
