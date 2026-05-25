import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export const sanityConfig = defineConfig({
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  title: "Allura Healthcare CMS",
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenido")
          .items([
            S.listItem()
              .title("⚙️ Configuración Global")
              .id("globalConfig")
              .child(
                S.document()
                  .schemaType("globalConfig")
                  .documentId("globalConfig")
              ),
          ]),
    }),
    visionTool(),
  ],
});
