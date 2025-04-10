# Daily Joke 😄

Daily Joke is a web application that provides a daily dose of laughter with a collection of jokes. Users can browse jokes by categories, view a random joke, and rate jokes.

## Preview

### Home 🏠

![alt text](https://github.com/lucas6028/daily-joke/blob/main/assets/preview/home.png)

### Random 🔀

![alt text](https://github.com/lucas6028/daily-joke/blob/main/assets/preview/random.png)

### Catogory 📃

![alt text](https://github.com/lucas6028/daily-joke/blob/main/assets/preview/categories.png)

## Tech Stack

![alt text](https://github.com/lucas6028/daily-joke/blob/main/assets/tech_stack/stackshare.jpeg)

## Get Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

```sh
git clone https://github.com/lucas6028/daily-joke.git
cd daily-joke
```

2. Install dependencies

```sh
pnpm install
```

3. Create a `.env.local` file in the root directory and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
VAPID_PRIVATE_KEY=your-vapid-private-key
UPSTASH_REDIS_REST_URL=your-upstash-redis-rest-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-rest-token
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CRON_SECRET=your-cron-secret
CYPRESS_BASE_URL=http://localhost:3000
BASE_URL=http://localhost:3000
```

### Running the Development Server

Start the development server:

```sh
pnpm dev
```

Open `http://localhost:3000` with your browswer to see the result.

### Build the Production Server

To build the project for production, run:

```sh
pnpm build
```

### Starting the Production Server

After building the project, you can start the production server:

```sh
pnpm start
```

## Project Structure

- `app`: Contains the main application components and pages.
- `components`: Contains reusable UI components.
- `context`: Contains React context for managing global state.
- `data`: Contains mock data for jokes.
- `hooks`: Contains custom React hooks.
- `lib`: Contains Supabase client setup and get joke function.
- `public`: Contains static assets.
- `styles/`: Contains global CSS styles.
- `types`: Contains TypeScript type definitions.
- `utils`: Contains utility functions.

## API Routes

- `GET /api/joke/single`: Fetches jokes from the Supabase database.
- `POST /api/rating`: Inserts a new rating for a joke.
- `GET /api/rating`: Fetches ratings for a specific joke.
- `GET /api/revalidate`: Revalidate a page (default to home page).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License

---

Happy coding! 😄
