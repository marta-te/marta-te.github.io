# Marta Teivāne - Portfolio Website

A personal portfolio website featuring projects, art gallery, plant log, scrapbook, and blog.

## 🌟 Features

- **Homepage**: Hero section with About Me and section previews
- **Projects**: Showcase with banner images (loaded from JSON)
- **Art Gallery**: 
  - 3D Art: Embedded from ArtStation API
  - 2D Art: Local images loaded from JSON
- **Plants Log**: JSON-driven collection of found plants with dates and locations
- **Scrapbook**: Interactive filter system with 30+ scrapbook pages
- **Blog**: Structure ready for blog posts
- **About**: Personal information and skills

## 📁 File Structure

```
├── index.html              # Homepage with hero section
├── about.html              # About me page
├── projects.html           # Projects showcase
├── art.html               # Art gallery with tabs
├── plants.html            # Plant collection
├── scrapbook.html         # Scrapbook with filters
├── blog.html              # Blog listing
├── style.css              # Global styles
├── rain.js                # Background rain animation
├── plants.js              # Plants loader
├── artstation.js          # ArtStation API integration
├── art-2d.js              # 2D art loader
├── scrapbook.js           # Scrapbook filter system
├── projects.js            # Projects loader
├── plants.json            # Plant data
├── art-2d.json            # 2D art data
├── scrapbook.json         # Scrapbook pages & filters
├── projects.json          # Projects data
├── plants/                # Plant images
├── art-2d/                # 2D art images
├── scrapbook/             # Scrapbook page images
└── projects-images/       # Project banner images
```

## 🚀 Getting Started

### ArtStation Setup
1. Open `artstation.js`
2. Replace `YOUR_ARTSTATION_USERNAME` with your actual ArtStation username (2 places)
3. Also update in `art.html` line 53

### Adding Content

#### Plants
Edit `plants.json`:
```json
{
  "id": 3,
  "commonName": "Plant Name",
  "scientificName": "Scientific Name",
  "imagePath": "plants/image.jpg",
  "dateFound": "2026-02-04",
  "location": "Location name",
  "notes": "Optional notes",
  "tags": ["tag1", "tag2"]
}
```
Add images to `plants/` folder.

#### Projects
1. Add banner image to `projects-images/` folder
2. Edit `projects.json`:
```json
{
  "id": 3,
  "title": "Project Name",
  "description": "Description here",
  "bannerImage": "projects-images/your-banner.jpg",
  "link": "https://project-url.com",
  "technologies": ["Tech1", "Tech2"],
  "year": "2026"
}
```

#### 2D Art
1. Add artwork to `art-2d/` folder
2. Edit `art-2d.json`:
```json
{
  "id": 3,
  "title": "Artwork Title",
  "medium": "Digital Painting",
  "dateCreated": "2026-02-04",
  "imagePath": "art-2d/your-art.jpg",
  "description": "Description"
}
```

#### Scrapbook
1. Add 30 scrapbook page images to `scrapbook/` folder
2. Name them: `page-01.jpg`, `page-02.jpg`, etc.
3. Edit `scrapbook.json` to add metadata:
```json
{
  "id": 4,
  "imagePath": "scrapbook/page-04.jpg",
  "colors": ["pink", "cream"],
  "styles": ["vintage"],
  "elements": ["florals"],
  "mood": ["dreamy"]
}
```

#### Blog Posts
Create HTML files in a `blog/` folder and link from `blog.html`. Uncomment the example structure and customize.

## 🎨 Color Scheme

- Primary Background: `#1C002E` (Deep Purple)
- Primary Foreground: `#F0E5DF` (Cream)
- Accent: `#B7AFF0` (Light Purple)
- Button: `#4D3A99` (Medium Purple)

## 🌐 Deployment

This site is designed for GitHub Pages. Simply push to your repository and enable GitHub Pages in settings.

## 📝 Notes

- The rain animation runs on the homepage background
- All navigation is consistent across pages
- Scrapbook filters use AND logic within categories, OR across categories
- ArtStation integration fetches fresh data on each page load
- Plant and art data loads from JSON for easy updates

## ⚠️ TODO

- [ ] Replace `YOUR_ARTSTATION_USERNAME` in artstation.js and art.html
- [ ] Add your project banner images
- [ ] Add your 2D artwork
- [ ] Add 30 scrapbook page images
- [ ] Update About page content
- [ ] Add actual plants data
