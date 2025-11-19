# Time Zone Sync

A modern, interactive web application for coordinating times across multiple time zones. Built with React and Vite, featuring a beautiful glassmorphism UI and smooth animations.

## Features

- **Visual Time Synchronization**: Use an interactive slider to see how time changes across all your selected cities simultaneously.
- **Home City Management**: Set a "Home" city as your reference point. All other times are calculated relative to this base.
- **Customizable City List**: Add cities from around the world or define custom locations.
- **Persistent Settings**: Your cities, home selection, and theme preferences are saved automatically.
- **Dark/Light Mode**: Toggle between a sleek dark mode and a clean light mode.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

## Tech Stack

- **Frontend Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS with Glassmorphism effects
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date/Time Handling**: [date-fns](https://date-fns.org/) & [date-fns-tz](https://github.com/marnusw/date-fns-tz)

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository (if applicable) or navigate to the project directory.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173` (or the URL shown in your terminal).

## Usage

1. **Add a City**: Click the "Add City" button to search for a city or add a custom one.
2. **Set Home City**: Click the "Make Home" button on any city card to set it as your primary reference time.
3. **Check Times**: Drag the slider at the top to change the time in your home city and watch all other cities update instantly.
4. **Remove City**: Click the "X" on a city card to remove it from your list.
