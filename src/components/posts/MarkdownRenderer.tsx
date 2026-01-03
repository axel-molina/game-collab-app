import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Helper to extract YouTube video ID
const getYouTubeVideoId = (url: string) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/|live\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

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
        p: ({ node, ...props }) => (
          <p className="mb-4 leading-7 break-words" {...props} />
        ),
        // Customize lists
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
        ),
        // Customize links
        a: ({ node, children, ...props }) => {
          const href = props.href || "";
          const videoId = getYouTubeVideoId(href);

          // If it's a YouTube link and the link text is just the URL (naked link), embed it
          if (
            videoId &&
            children &&
            children.length > 0 &&
            typeof children[0] === "string" &&
            (children[0] === href || href.includes(children[0]))
          ) {
            return (
              <div className="aspect-video w-full my-6 rounded-lg overflow-hidden border border-border bg-black shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            );
          }

          return (
            <a
              className="text-primary hover:underline font-medium break-words"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          );
        },
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
