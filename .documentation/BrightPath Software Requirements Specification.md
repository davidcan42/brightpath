# BrightPath Software Requirements Specification (SRS)

### System Design
The system is composed of four primary parts:
1.  **Frontend PWA:** A responsive Next.js application that serves the user interface to all devices (mobile, web, desktop). It handles all user interactions and state management on the client side.
2.  **Backend API:** A set of serverless functions, co-located within the Next.js application (using API Routes), that manage business logic, database interactions, and secure communication with external services.
3.  **Databases:** A hybrid database system to handle both structured user data and flexible content data.
4.  **External Services:** Third-party APIs that provide core functionality, including the OpenAI API for content processing and an authentication provider for user management.

### Architecture pattern
*   **Frontend:** Component-Based Architecture. The UI is built from a library of reusable, self-contained React components (`KnowledgeCard`, `ProgressBar`, `CreationButton`, etc.) that manage their own local state.
*   **Backend:** Serverless Monorepo. The backend logic will be implemented as a collection of serverless functions within the same repository as the frontend (`/pages/api/`). This simplifies development and deployment for the MVP while allowing for future separation into microservices if needed.

### State management
*   **Client-Side Fetching & Caching:** `SWR` or `React Query` will be used for data fetching, caching, and revalidation. This handles server state like the content feed and user progress efficiently.
*   **Client-Side Global UI State:** `Zustand` or `React Context API` will be used for managing global UI state that is shared across components, such as the authenticated user's profile, theme, and age-group settings.
*   **Client-Side Local UI State:** Standard React state (`useState`, `useReducer`) will be used for state that is confined to a single component, such as form inputs or the open/closed state of a modal.

### Data flow
1.  **User Authentication:** User signs in via the Auth Provider. The Frontend receives a JWT (JSON Web Token), which is stored securely in an httpOnly cookie.
2.  **Content Fetch:** The Frontend sends an authenticated request to the Backend API (e.g., `GET /api/content/feed`).
3.  **Backend Processing:** The Backend verifies the JWT, queries the Databases for relevant content based on user preferences, and returns a JSON payload.
4.  **Rendering:** The Frontend receives the data and uses it to render the "Knowledge Stream" of `KnowledgeCard` components.
5.  **Interactive Learning:** User submits an answer in the "We Do" phase. The Frontend sends the data to the Backend (`POST /api/interactions/feedback`). The Backend may call the OpenAI API for analysis before returning real-time feedback to the user.
6.  **Content Creation:** User uploads a "You Do" video. The Frontend sends the file to the Backend (`POST /api/creations`), which stores it and updates the `User_Creations` database table.

### Technical Stack
*   **Language:** TypeScript
*   **Frontend Framework:** React (via Next.js)
*   **Backend Framework:** Node.js (via Next.js API Routes)
*   **Styling:** Tailwind CSS
*   **Database ORM:** Prisma (to manage connections to both PostgreSQL and MongoDB)
*   **Databases:**
    *   **PostgreSQL:** For structured, relational data (Users, Progress, Scores, Relationships).
    *   **MongoDB:** For unstructured/semi-structured content (AI-processed stories, user-generated videos/posts).
*   **Authentication:** NextAuth.js or Clerk (for rapid implementation of social & passwordless login).
*   **AI Integration:** OpenAI API (specifically the GPT-4 endpoint).
*   **Deployment:** Vercel

### Authentication Process
1.  User initiates login/signup from the Frontend.
2.  The client-side interacts with the chosen authentication provider (e.g., NextAuth.js).
3.  User signs in using a social provider (Google) or email.
4.  Upon successful authentication, the provider creates a `User` record in the PostgreSQL database and returns a JWT to the client.
5.  The JWT is stored in a secure, httpOnly cookie. All subsequent requests from the client to the Backend API will include this cookie for authorization.
6.  Backend API routes are protected by middleware that validates the JWT on every request.

### Route Design
*   **Public Routes:**
    *   `/` - Home/Dashboard (`KnowledgeStream`)
    *   `/auth/signin` - User login page
*   **Protected Routes:**
    *   `/learn/[topicId]` - The focused learning module interface.
    *   `/create` - The content creation studio (may be a modal over other routes).
    *   `/community` - The community hub for viewing user creations.
    *   `/profile/[userId]` - User profile and achievement gallery.
*   **API Routes:**
    *   `GET /api/content/feed` - Fetch content for the main stream.
    *   `GET /api/content/[topicId]` - Fetch data for a specific learning module.
    *   `POST /api/interactions` - Submit answers from "We Do" phase.
    *   `POST /api/creations` - Submit new content from "You Do" phase.
    *   `GET /api/users/[userId]` - Fetch public user profile data.
    *   `PUT /api/users/me` - Update the current user's profile.

### API Design
The API will follow RESTful principles, using standard HTTP methods.
*   **`GET /api/resource`:** Retrieve a list or a single resource.
*   **`POST /api/resource`:** Create a new resource (e.g., a user creation, a comment).
*   **`PUT /api/resource/:id`:** Update an existing resource (e.g., a user's profile).
*   **`DELETE /api/resource/:id`:** Delete a resource.
*   All responses will be in JSON format. Authenticated endpoints will expect a valid JWT.

### Database Design ERD
(Expressed in Markdown text format)

**PostgreSQL (Relational Data)**

*   **`Users`**
    *   `id` (Primary Key, UUID)
    *   `email` (Unique, Text)
    *   `age` (Integer)
    *   `difficulty_preference` (Enum: 'Simplified', 'Standard', 'Advanced')
    *   `created_at` (Timestamp)
*   **`User_Progress`**
    *   `id` (Primary Key, UUID)
    *   `user_id` (Foreign Key -> Users.id)
    *   `module_id` (Text, references MongoDB ID)
    *   `status` (Enum: 'started', 'ido_complete', 'wedo_complete', 'youdo_complete')
    *   `score` (Integer)
    *   `updated_at` (Timestamp)

**MongoDB (Document Data)**

*   **`Content_Modules`**
    *   `_id` (Primary Key, ObjectId)
    *   `source_expert` (String)
    *   `topic_title` (String)
    *   `category` (String)
    *   `content` (Object)
        *   `i_do_story` (String/Array of objects)
        *   `we_do_exercise` (Object)
        *   `you_do_challenge` (String)
*   **`User_Creations`**
    *   `_id` (Primary Key, ObjectId)
    *   `user_id` (String, references PostgreSQL ID)
    *   `module_id` (String, references MongoDB ID)
    *   `content_type` (Enum: 'video', 'text')
    *   `content_url` (String, e.g., S3 bucket URL)
    *   `peer_reviews` (Array of objects)
    *   `created_at` (Timestamp)