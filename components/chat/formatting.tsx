import { DisplayMessage } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { preprocessLaTeX, renderCitations } from "@/utilities/formatting";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

export function Formatting({ message }: { message: DisplayMessage }) {
  const processedContent = preprocessLaTeX(message.content);

  // Apply a green background if the message is from the user
  const messageStyle =
    message.role === "user"
      ? "bg-green-500 text-white p-2 rounded-xl" // Green background for user messages
      : "bg-gray-100 text-black p-2 rounded-xl"; // Default style for AI messages

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
      return renderCitations(children, message.citations);
    },
  };

  return (
    <div className={messageStyle}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components as any}
        className="gap-3 flex flex-col"
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}

      {processedContent}
    </ReactMarkdown>
  );
}
