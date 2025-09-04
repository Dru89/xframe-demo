# XFrame Demo

A Next.js app demonstrating cross-domain iframe and popup messaging.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables (optional):
```bash
export DOMAIN_CLIENT=localhost:3000
export DOMAIN_DATALAYER=localhost:3001  
export DOMAIN_POPUP=localhost:3002
```

3. Run the development servers:
```bash
npm run dev
```

This will start three instances:
- Client: `http://localhost:3000`
- Frame: `http://localhost:3001` 
- Popup: `http://localhost:3002`

## Usage

- Visit `http://localhost:3000` for the main page
- The iframe loads `/frame` from port 3001 and popup opens `/popup` from port 3002
- Use the ping buttons to test cross-domain messaging
- All messages are logged in the console areas on each page
