import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Start of fix: Declare process for Node environment within this file
// This is necessary because tsconfig.json is set up for the DOM (browser), 
// so it doesn't know about Node's 'process' global.
declare const process: {
  cwd: () => string;
  env: Record<string, string | undefined>;
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})
