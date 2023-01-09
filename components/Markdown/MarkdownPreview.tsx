import React from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from "remark-gfm";
import twColors from '../../config/twColors';

// NOTE: From the plugin's website:
// Use of react-markdown is secure by default. Overwriting transformLinkUri or transformImageUri to something insecure will open you up to XSS vectors. Furthermore, the remarkPlugins, rehypePlugins, and components you use may be insecure.
// To make sure the content is completely safe, even after what plugins do, use rehype-sanitize. It lets you define your own schema of what is and isn’t allowed.
export default function MarkdownPreview({children}) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
      em: ({ node, ...props }) => <b className={twColors.textHL} {...props} />,
    }}>{children}</ReactMarkdown>
  )
}
