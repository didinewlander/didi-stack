
# didi-stack

**didi-stack** is a CLI tool that helps you quickly set up a basic frontend project using Vite, React, TypeScript, TailwindCSS, and Shadcn/UI. This tool simplifies the initial setup process for developers, allowing you to get started with a robust stack quickly and efficiently.

## Features

- **Vite + React + TypeScript** setup out of the box.
- Configured with **TailwindCSS** and **Shadcn/UI** for styling.
- Automatically sets up project structure and installs dependencies.
- Creates a clean, responsive grid-based landing page for easy navigation of documentation links.
- Git integration: Initializes a git repository and makes the initial commit.

## Installation

You can use `npx` to run **didi-stack** directly without installing it globally:

```bash
npx didi-stack init
```

Alternatively, you can install it globally:

```bash
npm install -g didi-stack
```

## Usage

To create a new project, simply run the following command:

```bash
npx didi-stack init
```

This command will guide you through the setup process, asking for the name of your project and then setting up everything for you.

## What’s Included

When you use **didi-stack** to create a new project, the following technologies and features are automatically configured:

- **Vite**: Fast build tool with hot module replacement (HMR).
- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: Static typing for better developer experience and error prevention.
- **TailwindCSS**: Utility-first CSS framework for quick and easy styling.
- **Shadcn/UI**: Beautiful, accessible UI components built on top of TailwindCSS.
- **Git**: Automatically initializes a git repository and makes the first commit.

## Project Structure

The generated project will have the following structure:

```bash
my-project/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── styles/
│   │   ├── globals.css
│   ├── App.tsx
│   ├── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Custom Landing Page

After the project is set up, the default landing page is replaced with a clean, responsive grid of documentation links for the following technologies:

- Vite
- React
- TailwindCSS
- Shadcn/UI

---
