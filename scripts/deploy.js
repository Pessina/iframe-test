#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment process...');

const rootDir = process.cwd();
const deployDir = path.join(rootDir, 'deploy');

// Clean and create deploy directory
console.log('🧹 Cleaning deploy directory...');
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true, force: true });
}
fs.mkdirSync(deployDir, { recursive: true });

// Build all projects locally
console.log('🔨 Building all projects locally...');
execSync('pnpm run build', { stdio: 'inherit' });

// Copy iframe-app
console.log('📦 Copying iframe-app...');
const iframeAppSource = path.join(rootDir, 'iframe-app');
const iframeAppDest = path.join(deployDir, 'iframe-app-deploy');
fs.cpSync(iframeAppSource, iframeAppDest, { recursive: true });

// Copy shared-components to iframe-app
const sharedComponentsSource = path.join(rootDir, 'shared-components', 'dist');
const iframeSharedDest = path.join(iframeAppDest, 'shared-components');
fs.cpSync(sharedComponentsSource, iframeSharedDest, { recursive: true });

// Create dist directory and copy CSS
const iframeSharedDistDest = path.join(iframeAppDest, 'shared-components', 'dist');
fs.mkdirSync(iframeSharedDistDest, { recursive: true });
fs.cpSync(path.join(sharedComponentsSource, 'index.css'), path.join(iframeSharedDistDest, 'index.css'));

// Update iframe-app package.json
const iframePackageJson = path.join(iframeAppDest, 'package.json');
const iframePackage = JSON.parse(fs.readFileSync(iframePackageJson, 'utf8'));
iframePackage.dependencies['@iframe-test/shared-components'] = 'file:./shared-components';
fs.writeFileSync(iframePackageJson, JSON.stringify(iframePackage, null, 2));

// Create shared-components package.json for iframe-app
const sharedPackageJson = {
  name: '@iframe-test/shared-components',
  version: '1.0.0',
  main: 'index.js',
  module: 'index.mjs',
  types: 'index.d.ts',
  dependencies: {
    '@radix-ui/react-dialog': '^1.0.5',
    '@radix-ui/react-progress': '^1.0.3',
    '@radix-ui/react-slot': '^1.0.2',
    '@radix-ui/react-tabs': '^1.0.4',
    'class-variance-authority': '^0.7.0',
    'clsx': '^2.0.0',
    'lucide-react': '^0.263.1',
    'tailwind-merge': '^2.0.0'
  }
};
fs.writeFileSync(path.join(iframeSharedDest, 'package.json'), JSON.stringify(sharedPackageJson, null, 2));

// Copy parent-app
console.log('📦 Copying parent-app...');
const parentAppSource = path.join(rootDir, 'parent-app');
const parentAppDest = path.join(deployDir, 'parent-app-deploy');
fs.cpSync(parentAppSource, parentAppDest, { recursive: true });

// Copy shared-components to parent-app
const parentSharedDest = path.join(parentAppDest, 'shared-components');
fs.cpSync(sharedComponentsSource, parentSharedDest, { recursive: true });

// Create dist directory and copy CSS for parent-app
const parentSharedDistDest = path.join(parentAppDest, 'shared-components', 'dist');
fs.mkdirSync(parentSharedDistDest, { recursive: true });
fs.cpSync(path.join(sharedComponentsSource, 'index.css'), path.join(parentSharedDistDest, 'index.css'));

// Update parent-app package.json
const parentPackageJson = path.join(parentAppDest, 'package.json');
const parentPackage = JSON.parse(fs.readFileSync(parentPackageJson, 'utf8'));
parentPackage.dependencies['@iframe-test/shared-components'] = 'file:./shared-components';
fs.writeFileSync(parentPackageJson, JSON.stringify(parentPackage, null, 2));

// Create shared-components package.json for parent-app
fs.writeFileSync(path.join(parentSharedDest, 'package.json'), JSON.stringify(sharedPackageJson, null, 2));

// Create .npmrc for parent-app
fs.writeFileSync(path.join(parentAppDest, '.npmrc'), 'legacy-peer-deps=true\n');

// Create simple vercel.json files
const vercelConfig = {
  framework: 'nextjs'
};
fs.writeFileSync(path.join(iframeAppDest, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));
fs.writeFileSync(path.join(parentAppDest, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));

console.log('✅ Deployment preparation complete!');
console.log('📁 Files ready for deployment:');
console.log('  - deploy/iframe-app-deploy/');
console.log('  - deploy/parent-app-deploy/');
console.log('');
console.log('🚀 Next steps:');
console.log('  1. Deploy iframe-app: cd deploy/iframe-app-deploy && vercel --prod');
console.log('  2. Deploy parent-app: cd deploy/parent-app-deploy && vercel --prod');
console.log('  3. Update parent-app environment with iframe URL');