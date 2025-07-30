# Fitness 24

This is a **Next.js** application for modern, seamless nutrition tracking, deployed at [https://fitness-24.vercel.app/](https://fitness-24.vercel.app/).

Fitness 24 lets users:
- Log meals and track macros with the world’s largest nutrition database.
- Visualize progress with beautiful, interactive charts.
- See personalized calorie and macro targets.
- Use the sleek, mobile-friendly dashboard as a guest (authentication coming soon!).

## Getting Started

Install dependencies:
```bash
npm install
# or
yarn dev
# or
pnpm install
# or
bun install
```


## Getting Started

Start the development server:


```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to use the app locally.

## Live Application

Try it live: [https://fitness-24.vercel.app/](https://fitness-24.vercel.app/)

## Features

- **Modern landing page** with premium gradients, SVG icons, and mobile-first design.
- **Guest mode:** Fully usable without account creation.
- **Food search** with auto-complete and nutritional breakdown.
- **Daily log**: Add, edit, or remove food and track nutrition totals.
- **Profile & target setup:** Calorie/protein targets auto-calculate (or set manually).
- **Visual progress:** Animated charts for weight, macro, and calorie analysis.
- **Installable as a PWA:** “Install App” prompt for easy mobile access.

**Coming soon:** Account registration and login functionality.

## Tech Stack

- [Next.js](https://nextjs.org) + [React](https://react.dev)
- TypeScript
- [Tailwind CSS](https://tailwindcss.com) for utility-first styling
- [Recharts](https://recharts.org) for chart visualizations
- Local Storage for guest session persistence

## Editing the Project

- The landing page source: `app/page.tsx`
- The main dashboard: `app/dashboard/page.tsx`
- Nutrition logic/config: `/config/FoodNutrionalInfo.json`
- Styles: Tailwind classes within component files

## Fonts

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to optimize and load [Geist](https://vercel.com/font).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

# Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for contribution guidelines.

## Deploying

Deploy instantly on the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

For deployment help, see [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).
