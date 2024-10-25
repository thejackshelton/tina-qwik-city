import { component$, jsx } from "@builder.io/qwik";

export type TinaMarkdownContent = {
  type: string;
  children: TinaMarkdownContent[];
};

export const TinaMarkdown = component$(
  ({
    content,
    components = {},
  }: {
    content: TinaMarkdownContent | TinaMarkdownContent[];
    components?: any;
  }) => {
    console.log("CONTENT: ", content);

    if (!content) {
      return null;
    }

    const nodes = Array.isArray(content) ? content : content.children;
    if (!nodes) {
      return null;
    }

    return (
      <>
        {nodes.map((child, index) => {
          return <Node components={components} key={index} child={child} />;
        })}
      </>
    );
  }
);

const Leaf = component$(
  (props: { type: "text"; text: string; components: any; bold?: boolean }) => {
    if (props.bold) {
      const { bold, ...rest } = props;
      return (
        <strong>
          <Leaf {...rest} />
        </strong>
      );
    }

    return <>{props.text}</>;
  }
);

const Node = component$<{
  components: any;
  child: TinaMarkdownContent;
}>(({ components, child }) => {
  const { children, ...props } = child;
  switch (child.type) {
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
    case "p":
    case "blockquote":
      if (components[child.type]) {
        console.log("COMPONENTS: ", components);
        const Component = components[child.type];

        return (
          <Component {...props}>
            <TinaMarkdown components={components} content={children} />
          </Component>
        );
      }
      return jsx(child.type, {
        children: <TinaMarkdown components={components} content={children} />,
      });

    case "mdxJsxTextElement":
    case "mdxJsxFlowElement":
      // @ts-ignore FIXME: TinaMarkdownContent needs to be a union of all possible node types
      const Component = components[child.name];
      if (Component) {
        // @ts-ignore FIXME: TinaMarkdownContent needs to be a union of all possible node types
        const props = child.props ? child.props : {};
        return <Component {...props} />;
      }

      return null;

    case "maybe_mdx":
      /**
       * We don't want to render this as it's only displayed while editing an mdx node and should
       * be transformed before form submission
       */
      return null;
    default:
      // @ts-ignore FIXME: TinaMarkdownContent needs to be a union of all possible node types
      if (typeof child.text === "string") {
        console.log("CHILD: ", child);
        // @ts-ignore FIXME: TinaMarkdownContent needs to be a union of all possible node types
        return <Leaf components={components} {...child} />;
      }
  }
});
