// Entrypoint for building the static site.
//
// This script bundles the static site generator using Parcel, which in turn
// will invoke Parcel again itself, reusing the same assets.

const Parcel = require("parcel-bundler");

process.env.NODE_ENV = "production";

const publicUrl = process.env.PARCEL_PUBLIC_URL || "/";

const bundler = new Parcel(["generator.js"], {
  outDir: ".cache/generator",
  publicUrl,
  target: "node",
  watch: false,
  minify: true,
  autoInstall: false,
});

bundler.bundle().then(() => require("./.cache/generator/generator.js"));