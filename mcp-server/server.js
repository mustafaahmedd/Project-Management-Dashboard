import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..');

// ── Helpers ──────────────────────────────────────────────

function readFile(relPath) {
  const full = path.join(PROJECT_ROOT, relPath);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, 'utf-8');
}

function listFiles(dir, exts = ['.jsx', '.js', '.css', '.json', '.md']) {
  const result = [];
  const full = path.join(PROJECT_ROOT, dir);
  if (!fs.existsSync(full)) return result;

  function walk(d, rel) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const entryRel = path.join(rel, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
        walk(path.join(d, entry.name), entryRel);
      } else if (exts.some((e) => entry.name.endsWith(e))) {
        result.push(entryRel);
      }
    }
  }
  walk(full, dir);
  return result;
}

// ── MCP Server ───────────────────────────────────────────

const server = new McpServer({
  name: 'projectpulse',
  version: '1.0.0',
});

// ── Resources ────────────────────────────────────────────

server.resource(
  'project-overview',
  'projectpulse://overview',
  async () => ({
    contents: [{
      uri: 'projectpulse://overview',
      mimeType: 'text/markdown',
      text: readFile('CLAUDE.md') || 'No CLAUDE.md found.',
    }],
  }),
);

server.resource(
  'file-structure',
  'projectpulse://files',
  async () => {
    const files = listFiles('src');
    return {
      contents: [{
        uri: 'projectpulse://files',
        mimeType: 'text/plain',
        text: `ProjectPulse Source Files:\n\n${files.join('\n')}`,
      }],
    };
  },
);

server.resource(
  'theme-config',
  'projectpulse://theme',
  async () => ({
    contents: [{
      uri: 'projectpulse://theme',
      mimeType: 'application/javascript',
      text: readFile('src/theme/darkTheme.js') || 'Not found.',
    }],
  }),
);

server.resource(
  'seed-data',
  'projectpulse://seed-data',
  async () => ({
    contents: [{
      uri: 'projectpulse://seed-data',
      mimeType: 'application/javascript',
      text: readFile('src/utils/seedData.js') || 'Not found.',
    }],
  }),
);

server.resource(
  'routing',
  'projectpulse://routing',
  async () => ({
    contents: [{
      uri: 'projectpulse://routing',
      mimeType: 'application/javascript',
      text: readFile('src/App.jsx') || 'Not found.',
    }],
  }),
);

// ── Tools ────────────────────────────────────────────────

server.tool(
  'read_source_file',
  'Read a source file from the ProjectPulse codebase',
  { filePath: z.string().describe('Relative path from project root, e.g. "src/pages/TasksPage.jsx"') },
  async ({ filePath }) => {
    const content = readFile(filePath);
    if (!content) {
      return { content: [{ type: 'text', text: `File not found: ${filePath}` }] };
    }
    return { content: [{ type: 'text', text: content }] };
  },
);

server.tool(
  'list_source_files',
  'List all source files in a directory of the ProjectPulse codebase',
  { directory: z.string().default('src').describe('Directory to list, e.g. "src/pages"') },
  async ({ directory }) => {
    const files = listFiles(directory);
    return {
      content: [{ type: 'text', text: files.length ? files.join('\n') : `No files found in ${directory}` }],
    };
  },
);

server.tool(
  'search_codebase',
  'Search for a pattern across all source files in ProjectPulse',
  {
    query: z.string().describe('Text or regex pattern to search for'),
    directory: z.string().default('src').describe('Directory to search in'),
  },
  async ({ query, directory }) => {
    const files = listFiles(directory);
    const results = [];
    const regex = new RegExp(query, 'gi');

    for (const filePath of files) {
      const content = readFile(filePath);
      if (!content) continue;
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (regex.test(lines[i])) {
          results.push(`${filePath}:${i + 1}: ${lines[i].trim()}`);
        }
        regex.lastIndex = 0;
      }
    }

    return {
      content: [{
        type: 'text',
        text: results.length
          ? `Found ${results.length} matches:\n\n${results.slice(0, 50).join('\n')}`
          : `No matches found for "${query}"`,
      }],
    };
  },
);

server.tool(
  'get_project_context',
  'Get a comprehensive summary of the ProjectPulse app — architecture, pages, contexts, data models, and conventions. Use this at the start of a conversation to get full context.',
  {},
  async () => {
    const claudeMd = readFile('CLAUDE.md') || '';
    const appJsx = readFile('src/App.jsx') || '';
    const files = listFiles('src');

    const pages = files.filter((f) => f.includes('/pages/'));
    const contexts = files.filter((f) => f.includes('/context/'));
    const components = files.filter((f) => f.includes('/components/'));
    const utils = files.filter((f) => f.includes('/utils/'));

    const summary = `# ProjectPulse — Full Context

## Overview
${claudeMd.split('\n').slice(0, 5).join('\n')}

## Architecture
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Material UI (dark theme)
- **State**: React Context + useReducer + localStorage (prefix: projectpulse_)
- **Routing**: React Router v6 with AppLayout wrapper

## Pages (${pages.length})
${pages.map((p) => `- ${p}`).join('\n')}

## Contexts (${contexts.length})
${contexts.map((c) => `- ${c}`).join('\n')}

## Components (${components.length})
${components.map((c) => `- ${c}`).join('\n')}

## Utils (${utils.length})
${utils.map((u) => `- ${u}`).join('\n')}

## Routing Setup
\`\`\`jsx
${appJsx}
\`\`\`

## Key Conventions
- Pages use PageHeader + FormDialog + ConfirmDialog pattern
- Framer Motion stagger animations for lists
- localStorage keys prefixed with "projectpulse_"
- uid() function generates IDs like "task-1n8kx3q"
- Dark theme: #0B0D11 bg, #12141A cards, #6C63FF primary, #00D4AA secondary
- Fonts: Inter (body), Plus Jakarta Sans (headings)
`;

    return { content: [{ type: 'text', text: summary }] };
  },
);

server.tool(
  'get_data_models',
  'Get all data models and their schemas used in ProjectPulse',
  {},
  async () => {
    const seedData = readFile('src/utils/seedData.js') || 'Not found';
    const contextFiles = listFiles('src/context');
    let contextCode = '';
    for (const f of contextFiles) {
      contextCode += `\n// === ${f} ===\n${readFile(f) || ''}\n`;
    }

    return {
      content: [{
        type: 'text',
        text: `# Data Models\n\n## Seed Data\n\`\`\`js\n${seedData}\n\`\`\`\n\n## Context Providers\n\`\`\`js\n${contextCode}\n\`\`\``,
      }],
    };
  },
);

// ── Prompts ──────────────────────────────────────────────

server.prompt(
  'start_session',
  'Initialize a new ProjectPulse development session with full context',
  async () => ({
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: `I'm working on ProjectPulse, a project management dashboard. Please use the get_project_context tool to load full context about the codebase, then let me know you're ready. I want to continue development.`,
      },
    }],
  }),
);

server.prompt(
  'add_feature',
  'Plan and implement a new feature for ProjectPulse',
  { feature: z.string().describe('Description of the feature to add') },
  async ({ feature }) => ({
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: `I want to add this feature to ProjectPulse: ${feature}\n\nFirst use get_project_context to understand the codebase, then plan the implementation following existing patterns (Context + Page + Sidebar nav).`,
      },
    }],
  }),
);

// ── Start ────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
