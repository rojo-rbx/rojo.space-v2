import React from "react";
import { MDXProvider } from "@mdx-js/react";

import style from "./MDXComponents.css";

const mdxify = Component => props => <Component className={ style[Component] } { ... props } />;

const primitives = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "a", "p", "strong", "em", "del",
  "ul", "ol", "li",
  "thematicBreak", "blockquote",
  "table", "thead", "tbody", "tr", "td", "th",
  "pre", "code", "inlineCode",
  "img",
];
const components = {};

for (const primitive of primitives) {
  components[primitive] = mdxify(primitive);
}

components.wrapper = ({ children }) => (
  <div className={ style.wrapper }>
    { children }
  </div>
);

export default function MDXComponents({ children }) {
  return (
    <MDXProvider components={ components }>
      { children }
    </MDXProvider>
  );
}