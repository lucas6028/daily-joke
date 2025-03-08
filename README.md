# Daily Joke Hub

Daily Joke Hub is a web application that provides a daily dose of laughter with a collection of jokes. Users can browse jokes by categories, view a random joke, and rate jokes.

## Preview

### Home

![alt text](https://github.com/lucas6028/daily-joke/blob/main/assets/previw/home.png)

### Random

![alt text](https://github.com/lucas6028/daily-joke/blob/main/assets/previw/random.png)

### Catogory

![alt text](https://github.com/lucas6028/daily-joke/blob/main/assets/previw/categories.png)

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
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Running the Development Server

Start the development server:

```sh
npm run dev
# or
yarn dev
```

Open `http://localhost:3000` with your browswer to see the result.

### Build the Production Server

To build the project for production, run:

```sh
npm run build
# or
yarn build
```

### Starting the Production Server

After building the project, you can start the production server:

```sh
npm start
# or
yarn start
```

## Project Structure

- `app`: Contains the main application components and pages.
- `components`: Contains reusable UI components.
- `context`: Contains React context for managing global state.
- `data`: Contains mock data for jokes.
- `hooks`: Contains custom React hooks.
- `lib`: Contains utility functions and Supabase client setup.
- `public`: Contains static assets.
- `styles/`: Contains global CSS styles.
- `types`: Contains TypeScript type definitions.

## API Routes

- `GET /api/supabase/fetch-jokes`: Fetches jokes from the Supabase database.
- `POST /api/supabase/insert-ratings`: Inserts a new rating for a joke.
- `GET /api/supabase/fetch-ratings`: Fetches ratings for a specific joke.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

License

---

Happy coding! 😄
