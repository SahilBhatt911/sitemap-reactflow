interface Section {
  name: string;
  description?: string;
}

interface Page {
  pageName: string;
  sections: Section[];
}

interface Sitemap {
  pageName: string;
  sections: Section[];
}

interface OldFormatField {
  id: string;
  name: string;
  description: string;
}

interface OldFormatNode {
  id: string;
  name: string;
  description: string;
  fields: OldFormatField[];
  children: OldFormatNode[];
}

interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { name: string; description: string; fields: OldFormatField[] };
}

interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

const convertNewSitemapToOldFormat = (sitemap: Sitemap[]): OldFormatNode[] => {
  const oldFormatSitemap: OldFormatNode[] = [];

  sitemap.forEach((page, pageIndex) => {
    const parentNode: OldFormatNode = {
      id: `pnode-${pageIndex + 1}`,
      name: page.pageName,
      description: "",
      fields: page.sections.map((section, index) => ({
        id: index.toString(),
        name: section.name,
        description: section.description || "",
      })),
      children: page.sections.map((section, sectionIndex) => ({
        id: `node-${pageIndex + 1}-${sectionIndex + 1}`,
        name: section.name,
        description: section.description || "",
        fields: [],
        children: [],
      })),
    };

    oldFormatSitemap.push(parentNode);
  });

  return oldFormatSitemap;
};

export const convertSitemapToFlow = (sitemap: Sitemap[]) => {
  const oldFormatSitemap = convertNewSitemapToOldFormat(sitemap);
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];

  const traverse = (
    node: OldFormatNode,
    parentId: string | null = null,
    xOffset = 0,
    level = 0
  ) => {
    let nodeX = xOffset;
    let nodeY = level * 400;

    const fields =
      node.fields && node.fields.length ? node.fields : [];

    if (parentId === null) {
      nodeX = 0; // Center the root node at x = 0
      nodeY = -fields.length * 30; // Center the root node at y = 0
    }

    nodes.push({
      id: node.id,
      type: "textUpdater",
      position: { x: nodeX, y: nodeY },
      data: { name: node.name, description: node.description, fields },
    });

    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        type: "smoothstep",
      });
    }

    if (node.children) {
      const childCount = node.children.length;
      const totalWidth = (childCount - 1) * 300; // Total width covered by children
      const startX = nodeX - totalWidth / 2; // Starting x position for the first child

      node.children.forEach((child, index) => {
        const childX = startX + index * 300; // Position each child evenly spaced
        traverse(child, node.id, childX, level + 1);
      });
    }
  };

  oldFormatSitemap.forEach((node, index) =>
    traverse(node, null, index * 400, 0)
  );
  return { nodes, edges };
};
