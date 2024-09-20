# Coding Conventions

This document outlines the coding conventions used in this project to ensure consistency and readability across the codebase.

## General Conventions

- **Indentation**: Use 2 spaces for indentation in HTML, CSS, and JavaScript files.
- **Line Length**: Limit lines to 80 characters where possible.
- **File Naming**: Use lowercase letters and hyphens for file names (e.g., `chatbot.js`).

## JavaScript

- **Variables**: Use `const` for constants and `let` for variables that will be reassigned.
- **Functions**: Use arrow functions for anonymous functions and method definitions for class methods.
- **Classes**: Use PascalCase for class names (e.g., `ChatBot`).
- **Comments**: Use JSDoc style comments for functions and classes. Inline comments should be used sparingly and only when necessary.

## HTML

- **Attributes**: Use double quotes for attribute values.
- **Structure**: Use semantic HTML elements where possible (e.g., `<header>`, `<footer>`, `<main>`).

## CSS

- **Selectors**: Use class selectors for styling and avoid using IDs for styling purposes.
- **Units**: Use `rem` and `em` for font sizes and `px` for borders and shadows.
- **Colors**: Use variables for colors to maintain consistency.

## Accessibility

- **ARIA**: Use ARIA roles and attributes to enhance accessibility.
- **Keyboard Navigation**: Ensure all interactive elements are focusable and operable via keyboard.

## Version Control

- **Commit Messages**: Use the format `type: description` (e.g., `feat: add new feature`).
- **Branch Naming**: Use the format `feature/description` or `bugfix/description`.
