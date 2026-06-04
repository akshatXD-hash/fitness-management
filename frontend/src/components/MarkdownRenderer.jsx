import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  return (
    <div className="prose-custom max-w-none overflow-hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-2xl font-black text-foreground mt-8 mb-4 border-b border-border pb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-bold text-primary mt-6 mb-3 flex items-center gap-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg font-bold text-foreground mt-5 mb-2" {...props} />,
          h4: ({node, ...props}) => <h4 className="text-base font-bold text-muted-foreground mt-4 mb-2 uppercase tracking-wider text-xs" {...props} />,
          p: ({node, ...props}) => <p className="text-muted-foreground leading-relaxed mb-4 text-sm" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-6 space-y-2 text-muted-foreground text-sm marker:text-primary" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-6 space-y-2 text-muted-foreground text-sm marker:text-primary font-bold" {...props} />,
          li: ({node, ...props}) => (
            <li className="pl-2">
              <span className="font-medium text-foreground/80">{props.children}</span>
            </li>
          ),
          strong: ({node, ...props}) => <strong className="font-black text-foreground" {...props} />,
          em: ({node, ...props}) => <em className="text-primary/80 italic" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-primary/50 pl-4 py-2 my-6 bg-muted/50 text-muted-foreground italic rounded-r-lg" {...props} />
          ),
          code: ({node, inline, ...props}) => 
            inline 
              ? <code className="bg-muted text-primary px-1.5 py-0.5 rounded text-xs font-mono font-bold" {...props} />
              : <code className="block bg-muted text-muted-foreground p-4 rounded-xl my-4 overflow-x-auto font-mono text-sm border border-border shadow-inner" {...props} />,
          hr: ({node, ...props}) => <hr className="border-border my-8" {...props} />,
          // Table styles
          table: ({node, ...props}) => (
            <div className="overflow-x-auto my-6 border border-border rounded-xl">
              <table className="w-full text-sm text-left border-collapse" {...props} />
            </div>
          ),
          thead: ({node, ...props}) => <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b border-border" {...props} />,
          tbody: ({node, ...props}) => <tbody className="divide-y divide-border" {...props} />,
          tr: ({node, ...props}) => <tr className="hover:bg-muted/30 transition-colors" {...props} />,
          th: ({node, ...props}) => <th className="px-4 py-3 font-bold text-foreground border-r border-border last:border-0" {...props} />,
          td: ({node, ...props}) => <td className="px-4 py-3 text-muted-foreground border-r border-border last:border-0" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
