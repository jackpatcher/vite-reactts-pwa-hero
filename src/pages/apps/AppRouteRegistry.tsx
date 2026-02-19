import React from "react";
import type { AppDef } from "../../data/apps";
import { renderSarabunContent } from "./sarabun/app_route";

type RenderProps = {
  app: AppDef;
  pageDef?: { id: string; label: string; path: string } | undefined;
  pageIndex?: number;
};

// Return a React node for apps that need custom routing/rendering.
// Add new apps here when you want app-specific page composition.
export function renderAppContent({ app, pageDef }: RenderProps): React.ReactNode | null {
  if (app.id === "sarabun") {
    return renderSarabunContent({ pageDef });
  }

  // Fallback: no custom rendering for this app
  return null;
}

export default renderAppContent;
