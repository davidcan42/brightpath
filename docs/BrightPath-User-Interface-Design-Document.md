# BrightPath User Interface Design Document

### Layout Structure
*   **Main View (Desktop/Web):** A two-column responsive layout.
    *   **Left Column (2/3 width):** The primary content area, featuring the "Knowledge Stream" - a vertical feed of content cards.
    *   **Right Column (1/3 width):** A sticky sidebar containing the user's Profile summary, current learning progress trackers, and a prominent "Create New Post" call-to-action.
*   **Main View (Mobile):** A single-column layout.
    *   The "Knowledge Stream" is the primary view.
    *   A persistent bottom tab bar provides navigation: `Home` | `Search` | `Create (central & prominent)` | `Community` | `Profile`.
*   **Learning Module View:** When a user clicks a content card, the view transitions to a full-screen, focused interface that clearly displays the three-phase progression (`I Do` -> `We Do` -> `You Do`) via a top-level progress bar.

### Core Components
*   **Knowledge Card:** The fundamental unit of the feed. Each card displays the topic title, expert source (e.g., "Huberman Lab"), category, difficulty indicator, and an engaging cover image or short video preview.
*   **Progress Bar:** Used within learning modules to show progress through the "I Do, We Do, You Do" stages. Visually fills as the user completes each phase.
*   **AI Feedback Window:** A chat-like interface used during the "We Do" phase for interactive exercises and real-time guidance.
*   **Creation Button:** A distinct, high-contrast button, always accessible from the main navigation (bottom-center on mobile, top of the sidebar on desktop).
*   **User-Generated Content Card:** Visually distinct from expert content cards, highlighting the creator's profile picture and name, and showcasing peer reviews or scores.

### Interaction patterns
*   **Scrolling:** Users scroll vertically through the "Knowledge Stream" for infinite content discovery.
*   **Tapping/Clicking:** Tapping a Knowledge Card initiates the "I Do" learning phase.
*   **Swiping:** Within the "I Do" story mode, users can swipe left/right to navigate through multimedia story segments.
*   **Modal Pop-ups:** Clicking the "Create" button opens a full-screen modal with content creation tools (video, text, etc.), keeping the user in context.
*   **Hover States:** On desktop, cards and interactive elements will subtly lift or change color on hover to indicate clickability.

### Visual Design Elements & Color Scheme
*   **Aesthetic:** Clean, vibrant, and modern. Balances negative space with engaging visuals.
*   **Primary Color:** `#0052FF` (A bright, trustworthy blue) - Used for primary buttons, links, and active states.
*   **Secondary Color:** `#F0F2F5` (A light, cool gray) - Used for backgrounds and card surfaces.
*   **Accent Color:** `#FFA500` (A warm, energetic orange) - Used for the "Create" button, call-to-actions, and gamification rewards to draw attention.
*   **Text Color:** `#1C1E21` (A very dark, near-black) for high readability.
*   **Iconography:** `SF Symbols` or a similar clean, line-art style icon set. Icons are simple and universally understood.

### Mobile, Web App, Desktop considerations
*   **Responsive Design:** The layout fluidly transitions from a multi-column desktop view to a single-column mobile view.
*   **PWA Functionality:** The interface is designed for touch-first interactions on mobile while fully supporting mouse and keyboard on desktop. Caching of content cards and modules for offline access is a core consideration.
*   **Navigation:** A top navigation bar on desktop collapses into a bottom tab bar on mobile for ergonomic, one-handed use.

### Typography
*   **Headings:** `Manrope` or a similar modern, geometric sans-serif font. Bold and with clear hierarchy (H1, H2, H3).
*   **Body Text:** `Inter` or a similar highly legible sans-serif font. Optimized for on-screen reading.
*   **Hierarchy:** Font size, weight, and color are used to create a clear visual hierarchy, guiding the user's attention from titles to body content to metadata.

### Accessibility
*   **Color Contrast:** The chosen color palette ensures a minimum WCAG AA contrast ratio for all text and essential UI elements.
*   **Focus States:** All interactive elements have a clear, visible focus state (e.g., a blue outline) for keyboard navigation.
*   **Labels & ARIA:** All icons and interactive controls will have descriptive `aria-labels` for screen reader compatibility.
*   **Font Sizing:** Users can adjust the base font size in their settings without breaking the UI layout. 