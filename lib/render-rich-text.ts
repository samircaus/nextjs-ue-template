/**
 * Renders AEM Content Fragment rich text JSON to HTML.
 * Handles nodeTypes: paragraph, text (with bold/italic), link, ordered-list, unordered-list, list-item.
 * @see https://experienceleague.adobe.com/docs/experience-manager-learn/getting-started-with-aem-headless/how-to/rich-text.html
 */

interface AemTextNode {
  nodeType: string;
  value?: string;
  format?: { variants?: string[] };
  content?: AemRichTextNode[];
  data?: { href?: string; path?: string; target?: string };
}

type AemRichTextNode = AemTextNode;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderInlineFormat(value: string, variants?: string[]): string {
  let out = escapeHtml(value);
  if (variants?.includes("bold")) out = `<strong>${out}</strong>`;
  if (variants?.includes("italic")) out = `<em>${out}</em>`;
  if (variants?.includes("underline")) out = `<u>${out}</u>`;
  return out;
}

function renderNode(node: AemRichTextNode): string {
  if (!node?.nodeType) return "";

  const children = node.content
    ? node.content.map((c) => renderNode(c)).join("")
    : "";

  switch (node.nodeType) {
    case "paragraph":
      return children ? `<p>${children}</p>` : "<p></p>";
    case "text":
      return renderInlineFormat(
        node.value ?? "",
        node.format?.variants
      );
    case "link": {
      const href = node.data?.href ?? "#";
      const target = node.data?.target ?? "_self";
      const value = node.value ?? href;
      return `<a href="${escapeHtml(href)}" target="${escapeHtml(target)}" rel="noopener noreferrer">${escapeHtml(value)}</a>`;
    }
    case "ordered-list":
      return children ? `<ol>${children}</ol>` : "";
    case "unordered-list":
      return children ? `<ul>${children}</ul>` : "";
    case "list-item":
      return children ? `<li>${children}</li>` : "";
    case "reference":
      // Inline reference (image or fragment). Render as link if we have value/href, else placeholder.
      const refHref = node.data?.href ?? node.data?.path ?? "#";
      const refValue = node.value ?? "Link";
      return `<a href="${escapeHtml(refHref)}">${escapeHtml(refValue)}</a>`;
    default:
      return children || (node.value ? escapeHtml(node.value) : "");
  }
}

/**
 * Converts AEM rich text JSON (array of nodes) to an HTML string.
 * Safe to pass undefined or non-array; returns "".
 */
export function aemRichTextJsonToHtml(json: unknown): string {
  if (json == null) return "";
  const nodes = Array.isArray(json) ? json : [];
  return nodes.map((node) => renderNode(node as AemRichTextNode)).join("");
}
