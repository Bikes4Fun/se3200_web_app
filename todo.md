# Dementia TV - Web Portal TODO

## Phase 1: Foundation (Do First)
- [x] Set up base CSS with CSS variables for theming
- [x] Create reusable nav component
- [x] Set up DataService with LocalStorage wrapper

## Phase 2: Core Shell
- [x] Dashboard page layout
- [x] Settings page shell
- [x] Family page shell
- [x] Medical page shell

## Phase 3: First Feature (Pick One)
- [x] Implement Settings page as proof of concept

---

## File Structure
```
se3200_web_app/
  index.html
  style.css
  js/
    app.js
    data-service.js
  pages/
    settings.html
    family.html
    medical.html
  assets/
```

## Key Architecture Decisions
- CSS variables for easy theming
- Single data-service.js handles all storage (easy to swap to API later)
- Each page is standalone HTML (simple, no build tools)
