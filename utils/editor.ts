export function getTitleAndBody(editor) {
  if (!editor) return { title: "", bodyHTML: "" };
  const json = editor.getJSON();
  const content = json.content || [];
  const [titleNode, ...bodyNodes] = content;

  // Helper to extract plain text from a node
  const getTextFromNode = (node) => {
    if (!node) return "";
    if (node.type === "text") return node.text || "";
    if (!node.content) return "";
    return node.content.map(getTextFromNode).join("");
  };

  const title = getTextFromNode(titleNode);

  // Get HTML for body nodes
  let bodyHTML = "";
  if (bodyNodes.length) {
    // Create a temp doc with only body nodes
    const tempDoc = { type: "doc", content: bodyNodes };
    bodyHTML = editor.clone().commands.setContent(tempDoc, false).getHTML();
  }

  return { title, bodyHTML };
}
