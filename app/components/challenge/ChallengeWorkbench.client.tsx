import { useStore } from '@nanostores/react';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
  type OnChangeCallback as OnEditorChange,
  type OnScrollCallback as OnEditorScroll,
} from '~/components/editor/codemirror/CodeMirrorEditor';
import { workbenchStore } from '~/lib/stores/workbench';
import { renderLogger } from '~/utils/logger';
import { EditorPanel } from '../workbench/EditorPanel';
import { Preview } from '../workbench/Preview';

const CHALLENGE_SCAFFOLD = {
  'src/App.tsx': `import { useState } from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Challenge</h1>
      <p>Start building your solution here!</p>
    </div>
  );
}

export default App;`,

  'src/App.css': `.App {
  text-align: center;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif;
}

.App h1 {
  color: #333;
  margin-bottom: 1rem;
}`,

  'src/main.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Challenge</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

  'package.json': `{
  "name": "challenge",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}`,

  'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,

  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,

  'tsconfig.node.json': `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`
};

export const ChallengeWorkbench = memo(() => {
  renderLogger.trace('ChallengeWorkbench');

  const currentDocument = useStore(workbenchStore.currentDocument);
  const unsavedFiles = useStore(workbenchStore.unsavedFiles);
  const files = useStore(workbenchStore.files);
  const selectedFile = useStore(workbenchStore.selectedFile);

  // Initialize the challenge scaffold when component mounts
  useEffect(() => {
    const initializeScaffold = async () => {
      try {
        // Set up the basic scaffold files
        const mockFiles = Object.entries(CHALLENGE_SCAFFOLD).reduce((acc, [path, content]) => {
          acc[path] = {
            type: 'file' as const,
            content,
          };
          return acc;
        }, {} as any);

        workbenchStore.setDocuments(mockFiles);
        workbenchStore.setShowWorkbench(true);

        // Select App.tsx by default
        workbenchStore.setSelectedFile('src/App.tsx');
      } catch (error) {
        console.error('Failed to initialize challenge scaffold:', error);
        toast.error('Failed to initialize challenge environment');
      }
    };

    if (Object.keys(files).length === 0) {
      initializeScaffold();
    }
  }, [files]);

  const onEditorChange = useCallback<OnEditorChange>((update) => {
    workbenchStore.setCurrentDocumentContent(update.content);
  }, []);

  const onEditorScroll = useCallback<OnEditorScroll>((position) => {
    workbenchStore.setCurrentDocumentScrollPosition(position);
  }, []);

  const onFileSelect = useCallback((filePath: string | undefined) => {
    workbenchStore.setSelectedFile(filePath);
  }, []);

  const onFileSave = useCallback(() => {
    workbenchStore.saveCurrentDocument().catch(() => {
      toast.error('Failed to update file content');
    });
  }, []);

  const onFileReset = useCallback(() => {
    workbenchStore.resetCurrentDocument();
  }, []);

  return (
    <div className="flex-1 flex">
      {/* Editor Panel */}
      <div className="flex-1 border-r border-bolt-elements-borderColor">
        <EditorPanel
          editorDocument={currentDocument}
          isStreaming={false}
          selectedFile={selectedFile}
          files={files}
          unsavedFiles={unsavedFiles}
          onFileSelect={onFileSelect}
          onEditorScroll={onEditorScroll}
          onEditorChange={onEditorChange}
          onFileSave={onFileSave}
          onFileReset={onFileReset}
        />
      </div>

      {/* Preview Panel */}
      <div className="flex-1">
        <Preview />
      </div>
    </div>
  );
});