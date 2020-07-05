// Custom static site generator using Parcel.
//
// This script cannot be run directly by Node.js, but can be built via Parcel
// and then run.

import Parcel from "parcel-bundler";
import path from "path";
import { promises as fs } from "fs";
import rimraf from "rimraf";

import React from "react";
import ReactDOMServer from "react-dom/server";
import { Helmet } from "react-helmet";
import { JSDOM } from "jsdom";
import { StaticRouter as Router } from "react-router-dom";

import App from "./src/components/App";

const CNAME = "v2.rojo.space";
const BASE_URL = process.env.PARCEL_PUBLIC_URL;

function main() {
  build({
    entry: "src/index.html",
    outDir: "dist",

    // A list of the initial pages that should be built. The code as-written
    // will crawl links to discover any pages linked from these initial
    // routes, as well.
    initialRoutes: [
      "/",

      // We can pass an object to override the output path of this route,
      // like if our static content host has specific requirements on 404
      // pages.
      {
        route: "/404",
        outputPath: "/404.html",
      },
    ],

    // Each page will be rendered by this function, defined below.
    renderPage,
  });
}

// renderPage is expected to render the passed in route and render it to
// a string containing HTML.
//
// We can do that however we want. Here we use React.
//
// `template` is given to us as an HTML string that has been processed
// by Parcel. It'll be the contents of `src/index.html`, but with CSS
// and JS references injected into it.
function renderPage(template, route, addRoute) {
  const context = {};

  const content = ReactDOMServer.renderToString(
    <Router location={ route } context={ context } basename={ BASE_URL }>
      <App />
    </Router>
  );
  const helmet = Helmet.renderStatic();

  const dom = new JSDOM(template);

  const main = dom.window.document.querySelector("#app");
  main.innerHTML = content;

  const extraHead = helmet.meta.toString() + helmet.title.toString();
  const head = dom.window.document.querySelector("head");
  head.insertAdjacentHTML("afterbegin", extraHead);

  if (context.url != null) {
    const redirect = dom.window.document.createElement("meta");
    redirect.setAttribute("http-equiv", "refresh");
    redirect.setAttribute("content", `0; URL='${ context.url }'`);

    head.appendChild(redirect);

    console.log("...redirects to", context.url);
  }

  // To add new pages, we can invoke `addRoute` with a site-relative
  // path.
  //
  // Here, we're just crawling the page for anything that looks like a
  // link.
  const links = dom.window.document.querySelectorAll("a");
  for (const link of links) {
    let url = link.href;

    // Rough pattern to ignore off-site links
    if (/^\w+:\/\//.test(url)) {
      continue;
    }

    if (url.startsWith(BASE_URL)) {
      url = url.slice(BASE_URL.length);
    }

    addRoute(url);
  }

  return dom.serialize();
}

// Build the given Parcel entrypoint. Individual pages are rendered using the
// `renderPage` callback, which should return HTML strings.
async function build({ entry, outDir, initialRoutes, renderPage }) {
  await rimrafPromise(outDir);
  await fs.mkdir(outDir, { recursive: true });

  const publicUrl = process.env.PARCEL_PUBLIC_URL || "/";

  const bundler = new Parcel([entry], {
    publicUrl,
    watch: false,
    minify: true,
    autoInstall: false,
  });

  await bundler.bundle();

  // This should be `entry`, but processed by Parcel.
  const template = await fs.readFile(path.join(outDir, path.basename(entry)));

  const visitedRoutes = new Set(initialRoutes);
  const routesToVisit = initialRoutes;

  const addRoute = route => {
    if (!visitedRoutes.has(route)) {
      visitedRoutes.add(route);
      routesToVisit.push(route);
    }
  };

  while (true) {
    let route = routesToVisit.pop();

    if (route == null) {
      break;
    }

    let outputPath;

    if (typeof route == "string") {
      outputPath = routeToFilePath(route);
    } else {
      outputPath = route.outputPath;
      route = route.route;
    }

    outputPath = path.join(outDir, outputPath);

    console.log(`Generating route ${ route }`);

    const rendered = renderPage(template, route, addRoute);

    console.log(`Saving to ${ outputPath }`);

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, rendered);
  }

  console.log("Writing CNAME file for GitHub Pages");
  const cnamePath = path.join(outDir, "CNAME");
  await fs.writeFile(cnamePath, CNAME);

  console.log("Writing .nojekyll file for GitHub Pages");
  const noJekyllPath = path.join(outDir, ".nojekyll");
  await fs.writeFile(noJekyllPath, "");
}

// Simple Promise wrapper around rimraf.
function rimrafPromise(dir) {
  return new Promise((resolve, reject) => {
    rimraf(dir, (err) => {
      if (err == null) {
        resolve();
      } else {
        reject(err);
      }
    });
  });
}

// Transforms a site-relative route for a page into a file path.
function routeToFilePath(route) {
  let current = "";

  for (const piece of route.split("/")) {
    if (piece.length === 0) {
      continue;
    }

    current = path.join(current, piece);
  }

  return path.join(current, "index.html");
}

main();