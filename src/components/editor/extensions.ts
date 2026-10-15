import { Extension, type CommandProps } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType;
      unsetLineHeight: () => ReturnType;
    };
    paragraphIndent: {
      increaseIndent: () => ReturnType;
      decreaseIndent: () => ReturnType;
    };
  }
}

type BlockName = "paragraph" | "heading";

function blockPositions(doc: CommandProps["state"]["doc"], from: number, to: number) {
  const positions: Array<{ pos: number; attrs: Record<string, unknown> }> = [];
  doc.nodesBetween(from, to, (node, pos) => {
    if (node.type.name === "paragraph" || node.type.name === "heading") {
      positions.push({ pos, attrs: { ...node.attrs } });
    }
  });
  return positions;
}

export const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types as string[],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize.replace(/['"]+/g, "") || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

export const LineHeight = Extension.create({
  name: "lineHeight",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"] satisfies BlockName[],
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight || null,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) return {};
              return { style: `line-height: ${attributes.lineHeight}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight:
        (lineHeight) =>
        ({ state, tr, dispatch }) => {
          const targets = blockPositions(state.doc, state.selection.from, state.selection.to);
          if (!targets.length) return false;
          if (dispatch) {
            for (const target of [...targets].reverse()) {
              tr.setNodeMarkup(target.pos, undefined, { ...target.attrs, lineHeight });
            }
            dispatch(tr);
          }
          return true;
        },
      unsetLineHeight:
        () =>
        ({ state, tr, dispatch }) => {
          const targets = blockPositions(state.doc, state.selection.from, state.selection.to).filter(
            (target) => target.attrs.lineHeight,
          );
          if (!targets.length) return false;
          if (dispatch) {
            for (const target of [...targets].reverse()) {
              tr.setNodeMarkup(target.pos, undefined, { ...target.attrs, lineHeight: null });
            }
            dispatch(tr);
          }
          return true;
        },
    };
  },
});

export const ParagraphIndent = Extension.create({
  name: "paragraphIndent",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"] satisfies BlockName[],
        attributes: {
          indent: {
            default: 0,
            parseHTML: (element) => {
              const raw = element.style.marginInlineStart || element.style.marginLeft;
              const value = Number.parseFloat(raw);
              if (!Number.isFinite(value) || value <= 0) return 0;
              return Math.min(8, Math.round(value / 24));
            },
            renderHTML: (attributes) => {
              const indent = Number(attributes.indent) || 0;
              if (indent <= 0) return {};
              return { style: `margin-inline-start: ${indent * 1.5}rem` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      increaseIndent:
        () =>
        ({ state, tr, dispatch }) => {
          const targets = blockPositions(state.doc, state.selection.from, state.selection.to).filter(
            (target) => (Number(target.attrs.indent) || 0) < 8,
          );
          if (!targets.length) return false;
          if (dispatch) {
            for (const target of [...targets].reverse()) {
              const indent = Number(target.attrs.indent) || 0;
              tr.setNodeMarkup(target.pos, undefined, { ...target.attrs, indent: indent + 1 });
            }
            dispatch(tr);
          }
          return true;
        },
      decreaseIndent:
        () =>
        ({ state, tr, dispatch }) => {
          const targets = blockPositions(state.doc, state.selection.from, state.selection.to).filter(
            (target) => (Number(target.attrs.indent) || 0) > 0,
          );
          if (!targets.length) return false;
          if (dispatch) {
            for (const target of [...targets].reverse()) {
              const indent = Number(target.attrs.indent) || 0;
              tr.setNodeMarkup(target.pos, undefined, { ...target.attrs, indent: indent - 1 });
            }
            dispatch(tr);
          }
          return true;
        },
    };
  },
});
