# Shrey Vats - Portfolio

A premium, minimalistic developer portfolio designed for a systems/Solana engineer. It focuses on a dark-by-default aesthetic, high-density information, and live GitHub statistics powered by GraphQL ISR.

## Tech Stack

- Framework: Next.js 14+ (App Router)
- UI Library: shadcn/ui
- Styling: Tailwind CSS
- Animation: Framer Motion
- Data Fetching: GitHub GraphQL API (Server-side with ISR)
- Typography: Geist Sans & Geist Mono
- Deployment: Vercel

## Setup & Local Development

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Generate a GitHub Personal Access Token (classic or fine-grained) with read access to public repositories and user data.
   
3. Create a `.env.local` file in the root of your project and add your token:
   ```env
   GITHUB_TOKEN=your_github_token_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding Projects

To add or update highlighted projects, edit the `src/data/projects.json` file. The structure supports custom tagging, impact statements, and dynamic fetching of the underlying repository stats (stars, forks, languages).

## Deployment

This portfolio is optimized for Vercel. Push the repository to your GitHub account and import it into Vercel. Ensure you add `GITHUB_TOKEN` to your Vercel Environment Variables so the live site can fetch your data securely on the server.
