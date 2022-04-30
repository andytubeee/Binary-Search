# Binary Search

We help CS/STEM students find their significant other!

## Getting Started

First, install required node packages

```bash
npm install
# or
yarn
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file. Other pages will also be located at the `pages/`,

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - it is important to learn React + Next.js for the development of this application

## Deployment

Binary Search is deployed on [www.binarysearch.club](https://www.binarysearch.club). Go register an account now!

# Features

Binary Search is powered by Google Firebase with an extensive amount of features.

## Authentication

Using Firebase authentication, you can create an account using email and password. Everything will be hashed automatically so don't worry about security. Additionally, you can also sign in with an existing Google account.

## Find Users

Once you are logged in, go to `/` to see a list of active users on the platform

## Chat

## Project

Once you are logged in, go to `/project` to publish new projects to your account, or manage your existing project.

Go to `/project/[uid]` to see the other user's published project by their user ID. This can be found at user's card on homepage.
