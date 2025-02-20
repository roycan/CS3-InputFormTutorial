# GitHub Pages Deployment Guide
> Deploy the Form Tutorial static content to GitHub Pages

## Important Note
GitHub Pages only supports static websites. The server-side functionality (form submissions) won't work. This deployment is for the tutorial content only.

## Prerequisites
- GitHub account
- Git installed on your computer
- Basic Git knowledge

## Step-by-Step Deployment

### 1. Prepare Your Repository

1. Create a new repository on GitHub
   - Go to github.com
   - Click "New Repository"
   - Name it `form-tutorial`
   - Make it public
   - Initialize with a README

2. Clone the repository locally
```bash
git clone https://github.com/your-username/form-tutorial.git
cd form-tutorial
```

### 2. Prepare Static Content

1. Create a docs folder (GitHub Pages will use this)
```bash
mkdir docs
```

2. Copy these files to the docs folder:
- All HTML files from `public/`
- CSS files
- Client-side JavaScript
- Tutorial content

3. Update links in HTML files
- Remove server-dependent features
- Update paths to be relative
- Remove form submission functionality

### 3. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click Settings
3. Scroll to "GitHub Pages" section
4. Select source:
   - Branch: `main`
   - Folder: `/docs`
5. Click Save

### 4. Push Your Changes

```bash
git add .
git commit -m "Prepare for GitHub Pages deployment"
git push origin main
```

### 5. Access Your Site
- Wait a few minutes for deployment
- Visit: `https://your-username.github.io/form-tutorial`

## Project Structure for GitHub Pages
```
docs/
├── index.html
├── styles.css
├── script.js
├── handlebars-tutorial.html
├── package-tutorial.html
└── server-tutorial.html
```

## Common Issues and Solutions

### Pages Not Updating
1. Wait a few minutes
2. Check repository settings
3. Verify branch and folder settings
4. Force a rebuild in repository settings

### Broken Links
1. Use relative paths
2. Start paths with `/form-tutorial/`
3. Update all internal links

### Missing Assets
1. Check file paths
2. Verify all files are in docs folder
3. Use relative paths for assets

## Best Practices
1. Keep the docs folder organized
2. Test locally before pushing
3. Use relative paths
4. Remove server-dependent code
5. Update README.md with deployment info

## Need Help?
- Check GitHub Pages documentation
- Verify repository settings
- Test site locally before deploying
- Use GitHub's troubleshooting guide

Remember: This deployment only includes static content. Server-side features won't work on GitHub Pages!
