# Formula 1 Frontend

A React and TypeScript frontend for a Formula 1 web application. The project brings together racing data, season context, standings, editorial content, and user-specific favorites in one responsive interface.

This repository contains the frontend application. It is designed to consume a Django REST Framework API for racing data, content, authentication, profiles, and favorites.

## Overview

The app is built for Formula 1 fans who want a clean way to explore the sport beyond a single race weekend. It includes pages for drivers, teams, races, standings, and articles, plus account features that let authenticated users save their favorite drivers, teams, and races.

The home page highlights the current season, upcoming race, latest completed race, and featured articles. List pages include search, filtering, and sorting so users can quickly move through the available F1 data.

## Features

- Formula 1 home dashboard with current season, upcoming race, latest race, and featured articles
- Driver directory with search, status filtering, sorting, profile pages, and favorites
- Team directory with team detail pages and favorite support
- Race calendar with race detail pages and favorite support
- Driver and constructor standings pages
- Articles section with featured articles, article lists, and slug-based article detail pages
- User registration, login, logout, password reset, and password change flows
- Protected dashboard with recent favorite drivers, teams, and races
- Editable user profile
- JWT authentication with automatic access-token refresh
- Responsive layout with light and dark theme support
- Shared loading, error, empty-state, image fallback, and list-control components

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Axios
- Django REST Framework API integration

## Main Pages

```txt
/                         Home
/drivers                  Driver list
/drivers/:id              Driver details
/teams                    Team list
/teams/:id                Team details
/races                    Race list
/races/:id                Race details
/standings                Driver and constructor standings
/articles                 Article list
/articles/:slug           Article details
/login                    Login
/register                 Register
/forgot-password          Request password reset
/reset-password-confirm   Confirm password reset
/dashboard                Protected user dashboard
/profile                  Protected profile page
/change-password          Protected password change page
```

## Project Structure

```txt
src/
├── api/          API clients for racing, content, standings, and auth
├── components/   Shared layout and reusable UI components
├── context/      Auth and theme providers
├── pages/        Route-level React pages
├── router/       App routes and protected route handling
├── types/        TypeScript models for API data
├── utils/        Token, theme, media, and API error helpers
├── App.tsx
├── main.tsx
└── index.css
```

## API

The frontend expects a Django REST Framework backend and reads the API base URL from:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

The API provides the app's Formula 1 data, article content, user authentication, profiles, and favorite resources. The Axios client attaches JWT access tokens to authenticated requests and refreshes expired access tokens when possible.

## Getting Started

Install dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp .env.example .env
```

Start the app:

```bash
npm run dev
```

## Available Scripts

```bash
npm run dev
```

Runs the app locally with Vite.

```bash
npm run build
```

Type-checks the project and creates a production build.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs ESLint across the project.

## Notes

This frontend is part of a larger Formula 1 application and is meant to work with a Django REST Framework backend. The focus of this repository is the user-facing React application.
