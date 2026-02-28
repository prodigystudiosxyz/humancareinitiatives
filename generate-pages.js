const fs = require("fs");
const path = require("path");

const pages = [
  "about-us",
  "impact-reports",
  "impact-stories",
  "impact-gallery",
  "our-projects",
  "1",
  "2",
  "3",
  "get-involved",
  "donate-zakat",
  "donate-sadaqah",
  "account",
  "care-magazine",
  "contact-us"
];

const basePath = path.join(__dirname, "app");

pages.forEach(page => {
  const dir = path.join(basePath, page);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const title = page.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  fs.writeFileSync(path.join(dir, "page.tsx"), `import React from 'react';

export default function Page() {
  return (
    <div className="page-container">
      <div className="hexagon-bg"></div>
      <div className="content">
        <h1>${title}</h1>
        <p>This page is currently empty.</p>
      </div>
    </div>
  );
}
`);
});

console.log("Pages generated");
