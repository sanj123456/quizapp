# PLAN

## Assumptions
- Backend API is running locally on `http://localhost:5000`.
- Backend endpoints available (as implemented):
  - Auth:
    - `POST /api/auth/register`
    - `POST /api/auth/login`
    - `GET /api/auth/me`
  - Quizzes:
    - `GET /api/quizzes` (published quizzes only, questions omitted)
    - `GET /api/quizzes/:id` (requires auth)
    - `GET /api/quizzes/my-quizzes` (requires auth)
    - `POST /api/quizzes` (admin)
    - `PUT /api/quizzes/:id` (requires auth)
    - `DELETE /api/quizzes/:id` (requires auth)
    - `POST /api/quizzes/:id/questions` (requires auth)
- The "public" requirement can be met with a dedicated public API. If that is not available, the UI can still be built, but taking a quiz will require authentication.
- Question types are limited to the backend-supported enums:
  - `multiple-choice`
  - `true-false`
  - `short-answer`

## Scope
### In scope
- React (Vite) frontend that supports:
  - Admin authentication.
  - Admin quiz creation (title/description).
  - Admin adding questions of supported types.
  - Admin listing/editing/deleting quizzes.
  - Public home page listing published quizzes.
  - Public take-quiz flow UI and results view.

### Out of scope
- Full public submission/evaluation handled by the backend (requires additional routes if not present).
- Advanced authoring features (reordering questions, editing/deleting individual questions, rich text, images).
- Persistent attempt history, analytics, leaderboards.

## Approach
- Use a Vite React app with:
  - `react-router-dom` for routing.
  - `axios` for API requests.
  - Material UI for basic layout/components.
- Add a Vite dev proxy (`/api` -> `http://localhost:5000`) to avoid CORS and to keep frontend calls simple.
- Implement an `AuthContext` to store the logged-in user and JWT token (in `localStorage`).
- Protect `/admin/*` routes with a `ProtectedRoute` wrapper.
- Admin quiz authoring approach:
  - Create quiz first (`POST /api/quizzes`) to obtain the quiz id.
  - Add questions one by one (`POST /api/quizzes/:id/questions`) using a question form that maps to backend schema.
- Public quiz taking approach:
  - List published quizzes using `GET /api/quizzes`.
  - For taking a quiz, fetch quiz details. If backend has no public endpoint, the UI will show an informative error.
  - Results view shows per-question correctness and total score.

## Scope changes during implementation
- The backend in the current workspace did not include the expected public routes (e.g., `/api/public/...`) for "take quiz" and "submit".
  - Change made: Implemented the public pages in React but (by default) uses `GET /api/quizzes/:id` which currently requires auth.
  - Change made: Implemented results computation in the frontend to keep the user flow demonstrable without adding new backend endpoints.
- UI alignment was adjusted by removing Vite starter template CSS constraints (`#root` max-width and body flex centering).

## Reflection (5 minutes)
If I had more time, next I would:
- Add/restore proper backend public endpoints:
  - `GET /api/public/quizzes/:id` returning quiz questions without answers.
  - `POST /api/public/quizzes/:id/submit` returning evaluated results.
- Improve admin authoring:
  - Edit/delete question support.
  - Question ordering (drag-and-drop) and validation.
  - Publish/unpublish workflow with clearer status.
- Improve UX:
  - Better form validation messages.
  - Loading skeletons, toasts/snackbars.
  - Better empty states and navigation.
- Add basic tests:
  - API service unit tests.
  - Component tests for the quiz-taking flow.
