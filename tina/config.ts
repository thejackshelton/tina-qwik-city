import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        format: "mdx",
        defaultItem: () => {
          return {
            // When a new post is created the title field will be set to "New post"
            title: "Jack testing default item",
          };
        },
        ui: {
          router: () => {
            return "/";
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "posted",
            label: "Date Posted",
            // required: true,
          },
          {
            type: "object",
            name: "blocks",
            list: true,
            templates: [
              {
                name: "Form",
                label: "Form",
                fields: [
                  {
                    type: "reference",
                    name: "form",
                    collections: ["form"],
                  },
                ],
              },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
            templates: [
              {
                name: "Form",
                label: "Form",
                fields: [
                  {
                    type: "reference",
                    name: "form",
                    collections: ["form"],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "form",
        label: "Forms",
        path: "content/forms",
        format: "mdx",
        defaultItem: () => {
          return {
            // When a new post is created the title field will be set to "New post"
            title: "Jack testing default item",
          };
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
