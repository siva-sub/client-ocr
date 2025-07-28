# Deployment Guide

This guide covers deploying the Client-Side OCR project to GitHub Pages and publishing to npm.

## GitHub Pages Deployment

### Automatic Deployment (Recommended)

The project is configured with GitHub Actions for automatic deployment:

1. **Push to main branch**: Any push to the `main` branch will automatically trigger deployment
2. **Manual trigger**: Go to Actions tab → Deploy to GitHub Pages → Run workflow

### Manual Deployment

If you need to deploy manually:

```bash
# Build for GitHub Pages
npm run build:gh-pages

# The built files will be in the 'docs' directory
# Commit and push the docs directory
git add docs
git commit -m "Update GitHub Pages build"
git push origin main
```

### GitHub Repository Settings

1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: /docs
5. Save

The site will be available at: https://[username].github.io/client-side-ocr/

## NPM Publishing

### Prerequisites

1. Create an npm account at https://www.npmjs.com/
2. Generate an access token:
   - Go to https://www.npmjs.com/settings/[username]/tokens
   - Click "Generate New Token"
   - Choose "Automation" type
   - Copy the token

3. Add the token to GitHub repository secrets:
   - Go to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your npm access token

### Publishing Process

#### Option 1: Release-based Publishing (Recommended)

1. Create a new release on GitHub:
   - Go to Releases → Create a new release
   - Choose a tag (e.g., v2.0.0)
   - Write release notes
   - Publish release

2. The GitHub Action will automatically publish to npm

#### Option 2: Manual Publishing via GitHub Actions

1. Go to Actions tab
2. Select "Publish to NPM" workflow
3. Click "Run workflow"
4. Enter the version number (e.g., 2.0.1)
5. Run the workflow

#### Option 3: Local Publishing

```bash
# Ensure you're logged in to npm
npm login

# Update version in package.json
npm version patch # or minor/major

# Build the library
npm run build:lib

# Publish to npm
npm publish
```

## Version Management

Follow semantic versioning:
- **Major (X.0.0)**: Breaking changes
- **Minor (0.X.0)**: New features, backward compatible
- **Patch (0.0.X)**: Bug fixes

Examples:
- `2.0.0`: Major release with RapidOCR integration
- `2.1.0`: Added new language support
- `2.0.1`: Fixed preprocessing bug

## Pre-Publishing Checklist

- [ ] Update version in package.json
- [ ] Update CHANGELOG.md with new changes
- [ ] Run tests: `npm run type-check`
- [ ] Build library: `npm run build:lib`
- [ ] Test the build locally
- [ ] Update README.md if needed
- [ ] Commit all changes
- [ ] Create git tag: `git tag v2.0.0`

## Post-Publishing Steps

1. Verify npm package: https://www.npmjs.com/package/client-side-ocr
2. Test installation: `npm install client-side-ocr@latest`
3. Update demo site if needed
4. Announce release on social media/forums

## Troubleshooting

### GitHub Pages Not Updating

- Check Actions tab for build errors
- Ensure `docs` directory is committed
- Clear browser cache
- Wait 5-10 minutes for GitHub Pages to update

### NPM Publish Fails

- Check npm token is valid
- Ensure version doesn't already exist
- Run `npm whoami` to verify login
- Check package.json for errors

### Build Errors

- Run `npm run type-check` to find TypeScript errors
- Check console for missing dependencies
- Ensure all imports are correct
- Try `npm ci` for clean install