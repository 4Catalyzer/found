import { Sandpack, type SandpackFile } from '@codesandbox/sandpack-react';
import { dracula, githubLight } from '@codesandbox/sandpack-themes';
import { useColorMode, usePrismTheme } from '@docusaurus/theme-common';
import React from 'react';

const createFileMap = (
  children: JSX.Element,
): Record<string, SandpackFile> => {
  const codeSnippets = React.Children.toArray(
    children,
  ) as React.ReactElement[];

  return codeSnippets.reduce(
    (
      result: Record<string, SandpackFile>,
      codeSnippet: React.ReactElement,
    ) => {
      if (codeSnippet.props.mdxType !== 'pre') {
        return result;
      }
      const { props } = codeSnippet.props.children;
      let filePath; // path in the folder structure
      let fileHidden = false; // if the file is available as a tab
      let fileActive = false; // if the file tab is shown by default

      if (props.metastring) {
        const [name, ...params] = props.metastring.split(' ');
        filePath = `/${name}`;
        if (params.includes('hidden')) {
          fileHidden = true;
        }
        if (params.includes('active')) {
          fileActive = true;
        }
      } else if (props.className === 'language-js') {
        filePath = '/App.js';
      } else if (props.className === 'language-ts') {
        filePath = '/App.tsx';
      } else if (props.className === 'language-tsx') {
        filePath = '/App.tsx';
      } else if (props.className === 'language-css') {
        filePath = '/styles.css';
      } else {
        throw new Error(`Code block is missing a filename: ${props.children}`);
      }
      if (result[filePath]) {
        throw new Error(
          `File ${filePath} was defined multiple times. Each file snippet should have a unique path name`,
        );
      }
      result[filePath] = {
        code: props.children as string,
        hidden: fileHidden,
        active: fileActive,
      };

      return result;
    },
    {},
  );
};

export default function SandpackEditor({
  children,
  startRoute,
  dependencies = {},
}: {
  children: JSX.Element;
  startRoute?: string;
  dependencies: { [key: string]: string };
}) {
  const files = createFileMap(children);
  const { colorMode } = useColorMode();
  const prismTheme = usePrismTheme();

  return (
    <div
      style={{
        // @ts-ignore
        '--prism-background-color': prismTheme.plain.backgroundColor,
        'marginBottom': '2rem',
      }}
    >
      <Sandpack
        template="react-ts"
        files={files}
        theme={colorMode === 'dark' ? dracula : githubLight}
        options={{
          startRoute,
          showNavigator: true,
          editorHeight: 400, // default - 300
          editorWidthPercentage: 60, // default - 50
          externalResources: [
            'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap-reboot.min.css',
          ],
        }}
        customSetup={{
          dependencies: {
            ...dependencies,
            'found': '*',
            'memoize-one': '^6.0.0',
          },
        }}
      />
    </div>
  );
}
