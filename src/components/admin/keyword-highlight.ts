import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import type { Node } from "prosemirror-model";

const keywordKey = new PluginKey<{
  keyword: string;
  decorations: DecorationSet;
}>("keywordHighlight");

let activeKeyword = "";

function getDecorations(doc: Node, keyword: string): DecorationSet {
  if (!keyword.trim()) return DecorationSet.empty;

  const decorations: Decoration[] = [];
  const escaped = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "gi");

  doc.descendants((node, pos) => {
    if (!node.isText) return;
    const text = node.text || "";
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const from = pos + match.index;
      const to = from + match[0].length;
      decorations.push(
        Decoration.inline(from, to, {
          nodeName: "mark",
          class: "keyword-highlight",
        })
      );
    }
  });

  return DecorationSet.create(doc, decorations);
}

export const KeywordHighlight = Extension.create<{
  keyword: string;
}>({
  name: "keywordHighlight",

  addOptions() {
    return { keyword: "" };
  },

  onCreate() {
    activeKeyword = this.options.keyword;
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: keywordKey,
        state: {
          init: (_, state) => ({
            keyword: activeKeyword,
            decorations: getDecorations(state.doc, activeKeyword),
          }),
          apply: (tr, prev, _oldState, newState) => {
            const meta = tr.getMeta(keywordKey);
            if (meta) {
              activeKeyword = meta.keyword;
              return {
                keyword: meta.keyword,
                decorations: getDecorations(newState.doc, meta.keyword),
              };
            }
            if (prev.keyword !== activeKeyword) {
              return {
                keyword: activeKeyword,
                decorations: getDecorations(newState.doc, activeKeyword),
              };
            }
            return {
              keyword: prev.keyword,
              decorations: prev.decorations.map(tr.mapping, tr.doc),
            };
          },
        },
        props: {
          decorations(state) {
            return keywordKey.getState(state)?.decorations ?? DecorationSet.empty;
          },
        },
      }),
    ];
  },
});

export function setKeyword(transaction: import("prosemirror-state").Transaction, keyword: string) {
  return transaction.setMeta(keywordKey, { keyword });
}
