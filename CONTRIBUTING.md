# Contributing to GameCollab

Thank you for your interest in contributing to GameCollab!

## License

By contributing, you agree that your contributions will be licensed under the [GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0.html).

## Getting Started

### Prerequisites

- Node.js 18+
- [Bun](https://bun.sh/) (recommended) or npm/yarn/pnpm
- Git

### Setup

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/<your-username>/game-collab-app.git
cd game-collab-app

# Install dependencies
bun install

# Create a .env file based on .env.example
cp .env.example .env.local

# Start development server
bun run dev
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── shared/          # Shared components (Hero, SEO, Spinner)
│   └── profile/         # Profile-related components
├── hooks/               # Custom React hooks
│   └── __tests__/       # Hook tests
├── i18n/                 # Internationalization
│   └── locales/         # Language files (en.json, es.json)
├── lib/                  # Utilities and constants
│   ├── __tests__/       # Unit tests
│   ├── constants.ts     # App constants
│   └── utils.ts         # Utility functions
├── pages/               # Page components
│   ├── auth/            # Authentication pages
│   ├── news/            # News/feed pages
│   ├── profile/         # User profile pages
│   └── .../             # Other feature pages
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## Development Guidelines

### Code Style

- Use **TypeScript** for all new code
- Follow existing naming conventions
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.tsx`)
- Utils/constants: camelCase (e.g., `constants.ts`)
- Pages: PascalCase in kebab-case folders (e.g., `user-profile/UserProfile.tsx`)

### Component Structure

```tsx
// Functional component with TypeScript
import { type FC } from 'react';

interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export const Component: FC<ComponentProps> = ({ title, onAction }) => {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  );
};
```

### Hooks

- Place in `src/hooks/`
- One hook per file
- Include tests in `__tests__/` subfolder
- Use named exports: `export const useAuth = ...`

### Testing

- Tests use **Vitest**
- Place tests in `__tests__/` folders next to the code they test
- Follow naming: `useProjects.test.tsx`

### Internationalization (i18n)

- All user-facing strings must use i18n keys
- Add keys to both `src/i18n/locales/en.json` and `src/i18n/locales/es.json`
- Use descriptive keys: `pages.profile.title`

## Branching Strategy

- `main` - Stable release
- `develop` - Development (if needed)
- `feature/*` - New features
- `fix/*` - Bug fixes
- `refactor/*` - Code refactoring

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add dark mode toggle
fix: resolve login redirect issue
docs: update README
refactor: simplify notification hook
test: add tests for useProjects
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following the guidelines
3. Ensure tests pass: `bun run test`
4. Ensure linting passes: `bun run lint`
5. Update documentation if needed
6. Submit a PR with a clear description
7. Link related issues

## Reporting Issues

- Use GitHub Issues
- Include bug reproduction steps
- Specify browser/OS if relevant
- Add labels appropriately

## Questions?

- Open a discussion on GitHub
- Check existing issues and discussions
