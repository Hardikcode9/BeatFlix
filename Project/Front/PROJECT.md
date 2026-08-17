# 🎬 BeatFlix

## Project Overview

BeatFlix is an AI-powered movie recommendation web application built with React.

Instead of endlessly scrolling through movie lists, users can discover movies based on their mood. In the future, BeatFlix will use AI facial emotion detection through the user's camera to recommend movies automatically.

---

# Tech Stack

Frontend
- React
- React Router DOM
- CSS
- React Icons

Backend (Future)
- Node.js
- Express.js
- MongoDB

Movie API (Future)
- TMDB API

AI (Future)
- Face Emotion Detection

---

# Current Project Status

Frontend Progress: ~70%

Backend Progress: 0%

API Integration: Pending

AI Integration: Pending

---

# Folder Structure

src/

├── assets/
│   ├── fonts/
│   └── images/
│       ├── about/
│       ├── hero/
│       ├── logo/
│       ├── movies/
│       ├── profile/
│       └── ui/
│
├── components/
│   ├── common/
│   │   ├── Navbar.js
│   │   └── Footer.js
│   │
│   ├── Hero.js
│   ├── AboutSection.js
│   ├── FeaturesSection.js
│   ├── CTASection.js
│   ├── MovieCard.js
│   ├── MovieGrid.js
│   ├── MoodAI.js
│   └── MoodSection.js
│
├── data/
│   └── movies.js
│
├── pages/
│   ├── Home.js
│   ├── Movies.js
│   ├── MovieDetails.js
│   ├── Moods.js
│   └── About.js
│
└── styles/

---

# Pages

## Home

Purpose

Landing page introducing BeatFlix.

Contains

- Hero
- Experience BeatFlix
- Why Choose BeatFlix
- Call To Action

---

## Movies

Displays every movie using MovieGrid.

Currently uses local data.

Future

TMDB API.

---

## Movie Details

Displays

- Poster
- Rating
- Genres
- Year
- Mood
- Description
- Similar Movies

---

## Moods

Purpose

Recommend movies based on mood.

Contains

- Mood Hero
- Search Mood
- Quick Mood Selection
- Recommendations

---

## About

Company/product style page explaining BeatFlix.

Contains

- Introduction
- AI Recommendation
- Movie Collection
- Features
- Statistics
- Future Enhancements
- Gallery
- Mission

---

# Current Features

✅ Mood Recommendation

✅ Movie Details

✅ Similar Movies

✅ Favorites (Local State)

✅ Trailer Links

✅ Responsive Layout

✅ Search UI

---

# Local Database

Current Movies

12

Each movie contains

- id
- title
- poster
- genre
- mood
- rating
- year
- trailer
- description

---

# Future Roadmap

Phase 1

Finish Frontend

Phase 2

TMDB API

Phase 3

Backend

Phase 4

Authentication

Phase 5

Face Emotion Detection
