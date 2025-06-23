# Food Vendor Web App

A web-based version of the Food Vendor inventory management app, built with Next.js and optimized for deployment on Vercel.

## Features

- **Inventory Management**: Add, edit, and delete food items across different categories
- **Search Functionality**: Search through food items and categories
- **Quantity Selection**: Select quantities for items with a user-friendly modal
- **List Generation**: Generate formatted lists for sharing or printing
- **Data Persistence**: Uses localStorage to save data across sessions
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with floating action buttons

## Categories Supported

- Food (Hot Dogs, Sausages, Pretzels, etc.)
- Beverages (Water, Sodas, Gatorade, Snapple, etc.)
- Ice Cream (Various bars, popsicles, frozen fruits, etc.)
- Nuts (Peanuts, Cashews, Almonds, Pecans)
- Miscellaneous (Supplies and condiments)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the webapp directory:
```bash
cd webapp
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

### Deployment to Vercel

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Vercel will automatically detect the Next.js configuration and deploy

Alternatively, use the Vercel CLI:
```bash
npx vercel
```

## Usage

1. **Adding Items**: Click the blue plus button to add new items to categories
2. **Selecting Quantities**: Click on any food item to select a quantity
3. **Editing Items**: Click the edit icon or right-click/long-press on items to edit or delete
4. **Generating Lists**: Use the bottom sheet to toggle between today's and tomorrow's lists
5. **Sharing**: Click the share button to share or copy the formatted list
6. **Undo**: Use the undo button to remove the last added item or long-press to clear all

## Key Differences from Mobile App

- Uses localStorage instead of AsyncStorage for data persistence
- Replaced React Native components with HTML/CSS equivalents
- Uses Web Share API when available, falls back to clipboard
- Right-click context menus instead of long-press gestures
- Optimized for both mouse and touch interactions

## Technology Stack

- **Framework**: Next.js 14
- **Language**: JavaScript (React)
- **Styling**: CSS Modules
- **Storage**: localStorage
- **Images**: Next.js Image component
- **Deployment**: Vercel-optimized with static export

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with modern JavaScript support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Same license as the original React Native application.
