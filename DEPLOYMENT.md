# Deployment Guide

This document explains how to deploy the iframe-test dApps to Vercel.

## Prerequisites

- Node.js 18+ and pnpm installed
- Vercel CLI installed and authenticated (`vercel login`)
- Access to the repository

## Current Working Deployments

✅ **iframe-app**: https://iframe-fgeh2c2lr-fspessinas-projects.vercel.app  
✅ **parent-app**: https://parent-edhemxxrd-fspessinas-projects.vercel.app

## Deployment Process

The deployment uses a build-locally approach with deployment directories:

### 1. Full Deployment (Recommended)

```bash
pnpm run deploy
```

This will:
1. Build shared components locally
2. Build both applications with all dependencies
3. Create standalone deployment directories
4. Deploy both applications to Vercel

### 2. Manual Steps

```bash
pnpm run deploy:prepare   # Build and prepare deployment directories
pnpm run deploy:iframe    # Deploy iframe-app
pnpm run deploy:parent    # Deploy parent-app
```

### 3. Individual Deployments

```bash
pnpm run deploy:iframe    # Deploy only iframe-app
pnpm run deploy:parent    # Deploy only parent-app
```

## Available Scripts

- `pnpm run deploy` - Deploy both applications
- `pnpm run deploy:iframe` - Deploy iframe-app only
- `pnpm run deploy:parent` - Deploy parent-app only
- `pnpm run build` - Build all applications
- `pnpm run build:components` - Build shared components only

## Environment Variables

### parent-app

Create a `.env.local` file in the parent-app directory:

```env
NEXT_PUBLIC_IFRAME_URL=https://your-iframe-app.vercel.app
```

Or set it in Vercel dashboard under project settings.

## Vercel Configuration

Both apps use `vercel.json` with monorepo support:

- Builds shared components first
- Installs dependencies from root
- Uses proper build commands for each app

## Directory Structure

```
iframe-test/
├── iframe-app/                 # iframe application
│   ├── vercel.json            # Vercel configuration
│   └── ...
├── parent-app/                 # Parent application
│   ├── vercel.json            # Vercel configuration
│   ├── .env.example           # Environment variables template
│   └── ...
└── shared-components/          # Shared component library
```

## Troubleshooting

### Common Issues

1. **Vercel CLI not authenticated**
   ```bash
   vercel login
   ```

2. **Missing dependencies**
   ```bash
   pnpm install
   ```

3. **Build failures**
   - Check shared components build: `pnpm run build:components`
   - Verify workspace dependencies are resolved

4. **iframe not loading**
   - Check `NEXT_PUBLIC_IFRAME_URL` is set correctly
   - Verify both apps are deployed and accessible

## Notes

- Uses Vercel's native monorepo support
- No file copying or complex build processes
- Environment variables handle cross-app communication
- Standard Vercel deployment workflow