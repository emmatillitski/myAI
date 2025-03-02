import { DisplayMessage } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { preprocessLaTeX } from "@/utilities/formatting";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { CitationCircle } from "./citation"; // Ensure this is the correct import

export function Formatting({ message }: { message: DisplayMessage }) {
  const processedContent = preprocessLaTeX(message.content);

  const components = {
    code: ({ children, className, node, ...rest }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return match ? (
        <SyntaxHighlighter
          {...rest}
          PreTag="div"
          className="rounded-xl"
          children={String(children).replace(/\n$/, "")}
          language={match[1]}
        />
      ) : (
        <code {...rest} className={className}>
          {children}
        </code>
      );
    },
    p: ({ children }: { children: React.ReactNode }) => {
      return (
        <div>
          <p>{children}</p>
          {/* Display clickable citation numbers below the text */}
          {message.citations?.length > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              {message.citations.map((citation, index) => (
                <CitationCircle key={index} number={index + 1} citation={citation} />
              ))}
            </div>
          )}
        </div>
      );
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={components as any}
      className="gap-3 flex flex-col"
    >
      {processedContent}
    </ReactMarkdown>
  );
}

      {processedContent}
    </ReactMarkdown>
  );
}
