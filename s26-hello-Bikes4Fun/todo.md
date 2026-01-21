# Dementia TV - Web Portal TODO

## Phase 1: Foundation
- [x] Set up base CSS with CSS variables for theming
- [x] Create reusable nav component (shared across pages via JS)
- [x] Set up DataService with LocalStorage wrapper

## Phase 2: Core Pages
- [x] Dashboard/About page with personal intro
- [x] Settings page with accessibility controls

## Phase 3: Assignment Requirements (Hello JS)
- [x] Name in `<h1>` tag
- [x] Images with captions
- [x] Paragraph about interests
- [x] 3 app ideas in `<ul>`/`<li>`
- [x] DOM querying and manipulation
- [x] Event handling (nav pop animation)
- [x] Professional styling

## Future Ideas
- [ ] Visit Scheduling - sync to patient's calendar
- [ ] Activity Dashboard - medication compliance history
- [ ] Family/Medical pages if needed

---

## File Structure
```
se3200_web_app/
  index.html      # Dashboard/About page
  settings.html   # Display settings
  settings.js     # Settings page logic
  app.js          # Shared nav + DataService
  style.css       # All styles
  IMG_0073.JPG    # Family photo 1
  IMG_6731.JPG    # Family photo 2
  todo.md
```

## Key Architecture Decisions
- CSS variables for easy theming
- Shared nav component injected via JS
- DataService wraps LocalStorage (easy to swap to API later)
- Flat file structure (simple, no build tools)
