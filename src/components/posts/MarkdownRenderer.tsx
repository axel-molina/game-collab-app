import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Customize heading styles
        h1: ({ node, ...props }) => (
          <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />
        ),
        // Customize paragraph
        p: ({ node, ...props }) => <p className="mb-4 leading-7" {...props} />,
        // Customize lists
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
        ),
        // Customize links
        a: ({ node, ...props }) => (
          <a
            className="text-primary hover:underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        // Customize code blocks
        code: ({ node, inline, ...props }) =>
          inline ? (
            <code
              className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
              {...props}
            />
          ) : (
            <code
              className="block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto mb-4"
              {...props}
            />
          ),
        // Customize blockquotes
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
            {...props}
          />
        ),
        // Customize tables
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto mb-4">
            <table
              className="min-w-full border-collapse border border-border"
              {...props}
            />
          </div>
        ),
        th: ({ node, ...props }) => (
          <th
            className="border border-border bg-muted px-4 py-2 text-left font-semibold"
            {...props}
          />
        ),
        td: ({ node, ...props }) => (
          <td className="border border-border px-4 py-2" {...props} />
        ),
        // Customize horizontal rule
        hr: ({ node, ...props }) => (
          <hr className="my-6 border-border" {...props} />
        ),
        // Customize images
        img: ({ node, ...props }) => (
          <img className="rounded-lg my-4 max-w-full h-auto" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
