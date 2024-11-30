// esbuild.config.js
const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: [
      "src/handlers/GetBook/getBook.ts",
      "src/handlers/UpdateBook/updateBook.ts",
      "src/handlers/CreateBook/createBook.ts",
      "src/handlers/DeleteBook/deleteBook.ts",
    ],
    bundle: true,
    platform: "node",
    target: "node20",
    outdir: "dist/src",
    external: ["aws-sdk"],
    minify: true,
    sourcemap: true,
  })
  .catch(() => process.exit(1));
