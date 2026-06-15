# UI/UX Design Brief

## 1. Design Philosophy
RemindSync follows a modern, enterprise SaaS design aesthetic heavily inspired by Linear, Notion, and Vercel.

**Key Traits:**
- Minimalist and clean
- High contrast
- Subtle and smooth micro-animations
- Fast, snappy feeling

## 2. Color Palette
The app supports both Light and Dark modes.

**Dark Mode (Primary Focus):**
- **Background**: `#0A0A0A` (Deep almost black)
- **Surface/Cards**: `#171717` (Subtle elevation)
- **Border**: `#262626`
- **Text Primary**: `#EDEDED`
- **Text Muted**: `#A1A1AA`

**Accent Colors (Priority/Status):**
- **Brand Primary**: `#3B82F6` (Vibrant Blue for primary actions)
- **High Priority (Red)**: `#EF4444`
- **Medium Priority (Amber)**: `#F59E0B`
- **Low Priority / Success (Green)**: `#10B981`

## 3. Typography
- **Primary Font**: `Inter` (sans-serif) for clean readability.
- **Headings**: Semi-bold, tight tracking.
- **Body**: Regular weight, optimal line height for readability.

## 4. Components & Layout
- **Sidebar**: Collapsible on mobile. Contains icon + text. Active states have a subtle background highlight and left border accent.
- **Cards (Reminders)**: Glassmorphism effect on hover. Show Title, Date, Priority dot, and Avatar stack (if shared).
- **Forms**: Floating labels or clean bordered inputs with focus rings (using brand primary).
- **Buttons**:
  - Primary: Solid background (brand color), white text.
  - Secondary: Transparent background, subtle border, hover state with lighter background.

## 5. Animations (Framer Motion)
- **Page Transitions**: Very fast (0.2s) fade and slide up (y: 10).
- **List Items**: Staggered entrance for reminder lists.
- **Hover States**: Slight scale up (1.02) and box-shadow increase for interactive cards.
- **Checkboxes**: Custom animated SVG checkmark drawing path upon completion.

## 6. Accessibility
- All interactive elements must have `aria-labels`.
- Contrast ratios must meet WCAG AA standards.
- Full keyboard navigation support (focus rings on `tab`).
