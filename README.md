# Spotfire/React Visualization Mod

This is a [Spotfire mod visualization](https://spotfiresoftware.github.io/spotfire-mods/docs/visualization-mods/) template powered by [React](https://react.dev/)

This Mod was created from a new spotfire visualization mod template as per the [Spotifre Mods documentation](https://spotfiresoftware.github.io/spotfire-mods/docs/getting-started/#developing-a-mod) and then tweaked to be able to use the React framework.

## Get Started
Download or clone this repo and from a terminal run:
 ``` sh
 npm install #install dependencies from package.json
 npm run build #Builds the od and generates types from the manifes
 npm run server #starts the live server so you can connec to spotfire (web or client)
```

## Quick Start Commands

Run these commands in your terminal after cloning this repository:

```sh
# Install all dependencies
npm install

# Build the mod and generate types from the manifest
npm run build

# Start the Spotfire Mods development server (for live reload and testing)
npm run server
```

- To rebuild automatically on code changes (development mode):
```sh
npm run build:dev
```

- To run TypeScript in watch mode (optional):
```sh
npm run tsc:dev
```

## Adding React to a Spotfire Visualization Mod template 
The result of this repo comes from a set of changes done to a regular Spotfire Visualization Mod template to add the React Framework. Here are the steps made in case you want to review the changes:

``` sh
npx @spotfire/mods-sdk@latest new visualization # create new spotfire visual mod template
npm install react react-dom #install react libraries
npm install --save-dev @types/react @types/react-dom
npm install @spotfire/mods-api #add spotfire api
npm install # Install all other dependencies.
```

### esbuild.config.js
Add these lines to export default
``` js
        loader: {
            ".js": "jsx",
            ".ts": "tsx",
            ".tsx": "tsx",
        },
        jsx: "automatic",
```

### Create src/App.tsx
This file is the React functional compmonent written in TypeScript and serves as the base for the custom visual

### main-react.tsx
This is a wrapper of main.ts and serves as an entry point for integrating the React app with Spotfire Mod framework. Basically we moved the logic from main.ts to main-react.tsx

### main.ts
We can still put logic here as we normally do, but if we want to use React, we pass the parameters to the main react function found in main-react.tsx

### tsconfig.json
Here we add a couple of additional settings to the compilerOptions for our Spotfire-React Visualization Mod
``` json
 "moduleResolution": "Bundler",
 "esModuleInterop": true,
 "jsx": "react-jsx" 
```

## Features Added (2025)

- **Color Axis Support:**
  - Bars are colored according to the Spotfire color axis (supports both categorical and continuous color axes).
- **Marking Support:**
  - Clicking a bar toggles its marked state in Spotfire. Marked bars are visually highlighted.
- **Tooltip on Hover:**
  - Hovering over a bar shows a tooltip with the X value, Y value, and color value.
- **Responsive Chart:**
  - The chart automatically resizes when the window or container is resized or maximized.
- **Best Practices:**
  - TypeScript null safety improvements for color axis values.
  - Cleaned up event listeners and chart disposal for performance.

## Usage Notes
- The chart is implemented using [ECharts](https://echarts.apache.org/).
- All Spotfire data access and marking is handled via the Spotfire Mods API.
- The main logic is in `src/App.tsx`.