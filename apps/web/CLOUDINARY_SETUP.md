# Cloudinary Setup for Multiple Image Uploads

## 🚀 What's Been Implemented

✅ **Multiple Image Upload System**
- Users can upload 3-10 portfolio images
- Images are stored on Cloudinary (CDN)
- Auto-optimization (WebP, compression, sizing)
- Professional folder structure

✅ **Email Integration**
- Admin gets all images in email
- Grid layout with thumbnails
- Clickable links to full-size images
- No emails sent to applicants

✅ **Database Integration**
- First image saved as main profile image
- All image URLs available via Cloudinary

## 🔧 Setup Required

### 1. Get Cloudinary Account (Free)
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Go to Dashboard
4. Copy these values:

### 2. Add Environment Variables
Add to your `.env.local` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your_cloud_name_here"
CLOUDINARY_API_KEY="your_api_key_here"  
CLOUDINARY_API_SECRET="your_api_secret_here"
```

### 3. Cloudinary Dashboard Values
In your Cloudinary dashboard, you'll see:
- **Cloud Name**: Something like `dxxxxxxxx`
- **API Key**: A number like `123456789012345`
- **API Secret**: A string like `abcdefghijklmnopqrstuvwxyz`

## 📁 How It Works

### File Organization
Images are stored in: `velgance/portfolios/firstname-lastname/`

Example:
```
velgance/
└── portfolios/
    ├── mario-rossi/
    │   ├── image1.jpg
    │   ├── image2.jpg
    │   └── image3.jpg
    └── anna-bianchi/
        ├── image1.jpg
        └── image2.jpg
```

### Image Optimization
- **Max size**: 1200x1600px
- **Auto format**: WebP when supported
- **Auto quality**: Optimized compression
- **CDN delivery**: Fast loading worldwide

### Email Format
You'll receive emails with:
- Applicant details
- Grid of portfolio images (thumbnails)
- Clickable links to full-size images
- Professional layout

## 🎯 Benefits

✅ **No server storage used**
✅ **Fast CDN delivery**
✅ **Auto image optimization**
✅ **Professional organization**
✅ **Multiple image support**
✅ **Free tier: 25GB storage**

## 🔗 URLs Format

Images will have URLs like:
```
https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/velgance/portfolios/mario-rossi/abc123.jpg
```

These URLs work everywhere and load super fast!

## 📧 What You'll Get in Email

```
Portfolio (3 foto)
┌─────────────┬─────────────┬─────────────┐
│   Image 1   │   Image 2   │   Image 3   │
│ [thumbnail] │ [thumbnail] │ [thumbnail] │
│   View Full │   View Full │   View Full │
└─────────────┴─────────────┴─────────────┘
```

Each thumbnail is clickable to view full size!
