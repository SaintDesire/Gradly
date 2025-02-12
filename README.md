## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features
- Browse & Filter Courses
- Purchase Courses using Stripe
- NoSQL database using Mongodb
- Authentication using Clerk
- ORM using Prisma
- Mark Chapters as Completed or Uncompleted
- Progress Calculation of each Course
- Student Dashboard
- Teacher mode
- Create new Courses
- Create new Chapters
- Easily reorder chapter position with drag n’ drop
- Upload thumbnails, attachments and videos using UploadThing
- Video player using react-player
- Rich text editor for chapter description

## Tech Stack
- Framework: Next.js 14
- Database: Prisma
- Authentication: Clerk
- UI Components: Radix UI, Shadcn/ui
- Forms: React Hook Form
- API Requests: Axios
- Styling: Tailwind CSS
- File Uploads: Uploadthing, Cloudinary
- Markdown Support: React Markdown Preview, React MD Editor

## Installation

### Set Up Environment Variables

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_REDIRECT=/

DATABASE_URL=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

NEXT_PUBLIC_TEACHER_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000

STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
```