#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import inquirer from "inquirer";
import ora from "ora";
import clear from "clear";
import chalk from "chalk";
import stripJsonComments from "strip-json-comments";

// Capture command-line arguments (excluding "node" and the script itself)
const args = process.argv.slice(2);

// Ensure the `init` command is provided
if (args.length === 0 || args[0] !== "init") {
  console.log(chalk.red.bold('Error: Missing or invalid command. Use "init".'));
  process.exit(1);
}

// Function to execute a command and log the output
const execCommand = (command, stage) => {
  const spinner = ora(chalk.bgWhite.bold(`- ${stage}`)).start();
  try {
    execSync(command, { stdio: "ignore", shell: true });
    spinner.succeed(chalk.green(` - ${stage}`));
  } catch (error) {
    spinner.fail(chalk.red(` - ${stage} (Failed)`));
    console.error(error);
    process.exit(1);
  }
};

// Function to clear the screen and show the spinner
const startStep = (message) => {
  console.log(chalk.cyan.bold(` - ${message}`));
};

// Function to read and parse JSON safely
const readJson = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const strippedContent = stripJsonComments(fileContent);
    return JSON.parse(strippedContent);
  } catch (error) {
    console.error(
      chalk.red.bold(`\nError reading or parsing JSON from ${filePath}:\n`),
      error
    );
    process.exit(1);
  }
};

// Function to write JSON safely
const writeJson = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(
      chalk.red.bold(`\nError writing JSON to ${filePath}:\n`),
      error
    );
    process.exit(1);
  }
};

// Interactive prompt to get the app name
inquirer
  .prompt([
    {
      type: "input",
      name: "appName",
      message: chalk.magenta.bold(
        "Let's get going. What will be the app's name "
      ),
      default: "Dont Leave Me Like This",
      prefix: false,
    },
  ])
  .then(async (answers) => {
    const appName = answers.appName;
    clear();

    // Step 1: Create Vite app
    startStep("Starting with our Vite + React (TypeScript) app");
    execCommand(
      `npm create vite@latest "${appName}" -- --template react-ts`,
      "Creating App"
    );

    // Change directory to the new app
    process.chdir(appName);

    // Step 2: Install project dependencies
    startStep("Installing project dependencies");
    execCommand("npm install", "Dependencies Installation");

    // Step 3: Install Tailwind CSS and related packages
    startStep("Installing TailwindCSS, cus you have style...");
    execCommand(
      "npm install -D tailwindcss postcss autoprefixer",
      "Installing TailwindCSS and Shadcn/ui"
    );

    // Step 4: Initialize Tailwind CSS
    execCommand("npx tailwindcss init -p", "Initializing TailwindCSS");

    // Step 5: Update tsconfig.json for path aliases
    const tsconfigPath = path.join(process.cwd(), "tsconfig.json");
    const tsconfig = readJson(tsconfigPath);
    tsconfig.compilerOptions = {
      ...tsconfig.compilerOptions,
      baseUrl: ".",
      paths: {
        "@/*": ["./src/*"],
      },
    };
    writeJson(tsconfigPath, tsconfig);
    console.log(chalk.green("✔  - Updated tsconfig.json"));

    // Step 6: Install Shadcn/ui dependencies
    execCommand(
      "npm install tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react",
      "Installing Shadcn/ui"
    );

    // Step 7: Configure Tailwind CSS
    const tailwindConfigPath = path.join(process.cwd(), "tailwind.config.js");
    const tailwindConfigContent = `
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: ['class'],
  content: ['src/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
`;
    fs.writeFileSync(tailwindConfigPath, tailwindConfigContent);
    console.log(chalk.green("✔  - Configured TailwindCSS"));

    // Step 8: Configure styles
    const globalsCssPath = path.join(process.cwd(), "src/styles/globals.css");
    const globalsCssContent = `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 47.4% 11.2%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 47.4% 11.2%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 100% 50%;
    --destructive-foreground: 210 40% 98%;
    --ring: 215 20.2% 65.1%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 224 71% 4%;
    --foreground: 213 31% 91%;
    --muted: 223 47% 11%;
    --muted-foreground: 215.4 16.3% 56.9%;
    --accent: 216 34% 17%;
    --accent-foreground: 210 40% 98%;
    --popover: 224 71% 4%;
    --popover-foreground: 215 20.2% 65.1%;
    --border: 216 34% 17%;
    --input: 216 34% 17%;
    --card: 224 71% 4%;
    --card-foreground: 213 31% 91%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 1.2%;
    --secondary: 222.2 47.4% 11.2%;
    --secondary-foreground: 210 40% 98%;
    --destructive: 0 63% 31%;
    --destructive-foreground: 210 40% 98%;
    --ring: 216 34% 17%;
    --radius: 0.5rem;
  }
}
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }
}
`;
    fs.mkdirSync(path.dirname(globalsCssPath), { recursive: true });
    fs.writeFileSync(globalsCssPath, globalsCssContent);
    console.log(chalk.green("✔  - Configured styles"));

    // Step 9: Write app.tsx file
    const appTsxPath = path.join(process.cwd(), "src/App.tsx");
    const newAppContent = `
    import './App.css';
    
    const docsLinks = [
      { name: 'Vite', url: 'https://vitejs.dev' },
      { name: 'React', url: 'https://react.dev' },
      { name: 'TailwindCSS', url: 'https://tailwindcss.com/docs' },
      { name: 'Shadcn/UI', url: 'https://ui.shadcn.com/' },
    ];
    
    function App() {
      return (
        <div className="min-h-screen py-8 px-4 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Didi-Stack UI Starter kit</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {docsLinks.map((doc) => (
              <a
                key={doc.name}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-200 p-6 shadow-lg rounded-lg transform transition hover:scale-105 hover:shadow-2xl"
              >
                <h2 className="text-xl font-semibold text-center text-gray-700">{doc.name}</h2>
              </a>
            ))}
          </div>
          <footer className="mt-12 text-gray-600">
            <p>Edit <code>src/App.tsx</code> and save to test HMR</p>
          </footer>
        </div>
      );
    }
    
    export default App;
    `;

    fs.writeFileSync(appTsxPath, newAppContent);
    // Edit main.tsx file
    const mainTsxPath = path.join(process.cwd(), "src/main.tsx");

    const newMainContent = `
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;

    fs.writeFileSync(mainTsxPath, newMainContent);

    const indexHtmlPath = path.join(process.cwd(), "index.html");

    // New content for the index.html file
    const newIndexContent = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Didi-Stack UI Starter</title>
   
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

    // Write the new content to index.html
    fs.writeFileSync(indexHtmlPath, newIndexContent);
    console.log("✔  - Landing page ready!");

    // Step 9: Add utility functions
    const utilsPath = path.join(process.cwd(), "src/lib/utils.ts");
    const utilsContent = `
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
    fs.mkdirSync(path.dirname(utilsPath), { recursive: true });
    fs.writeFileSync(utilsPath, utilsContent);
    console.log(chalk.green("✔  - Added utility functions"));

    // Step 10: Update package.json with custom scripts
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = readJson(packageJsonPath);
    packageJson.scripts = {
      ...packageJson.scripts,
      local: "vite --open",
    };
    writeJson(packageJsonPath, packageJson);
    console.log(chalk.green("✔  - Updated package.json with custom scripts"));

    // Step 11: Initialize a Git repository
    startStep("Initializing a Git repository");
    execCommand("git init", "Initializing Git repository");

    // Step 12: Create .gitignore file
    startStep("Creating .gitignore file");
    const gitignoreContent = `
node_modules/
dist/
.env
`;
    fs.writeFileSync(".gitignore", gitignoreContent);
    console.log(chalk.green("✔  - Created .gitignore file"));

    // Step 13: Make the initial commit
    startStep("Making the initial commit");
    execCommand("git add .", "Staging files for initial commit");
    execCommand('git commit -m "Initial commit"', "Making initial commit");

    console.log(
      chalk.green.bold("\nProject setup complete! Just run -\n"),
      chalk.white(`\n\tcd ${appName}\n`),
      chalk.white("\tnpm run local\n"),
      chalk.green.bold("\nand your app will be up in no time.\n")
    );
  });
