import dynamic from 'next/dynamic';
import '@uiw/react-markdown-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { useTheme } from 'next-themes';

const MEd = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  { ssr: false }
);

export default function MarkdownEditor({ value, onChange }) {
  const { theme, setTheme } = useTheme();

  return (
    <div data-color-mode={theme} className='border border-current rounded-sm'>
      <MEd
        className='text-base'
        value={value}
        visible
        height='65vh'
        enableScroll={false}
        indentWithTab={true}
        onChange={(value, viewUpdate) => onChange(value)}
      />
    </div>
  );
}
