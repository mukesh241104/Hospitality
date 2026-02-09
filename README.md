# Hospitality

A modern hotel search and comparison platform built with Next.js.

## Features

- 🔍 **Hotel Search** - Search hotels by destination and country
- 📊 **Comparison View** - Compare up to 4 hotels side-by-side with charts
- 🌙 **Dark Mode** - Full dark/light theme support
- 🔐 **Authentication** - Secure user authentication with Supabase
- 💾 **Persistent Selections** - Hotel selections saved to localStorage

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts with shadcn chart components
- **Auth**: Supabase Auth
- **API**: Hotelbeds Content API

## Getting Started

1. Clone the repository

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
   
   HOTELBEDS_API_KEY=your_api_key
   HOTELBEDS_API_SECRET=your_api_secret
   HOTELBEDS_ENDPOINT=https://api.test.hotelbeds.com
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

Add the environment variables in the Vercel dashboard.

## License

MIT
