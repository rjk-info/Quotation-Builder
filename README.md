# Quotation Builder

A modular MERN SaaS application for creating professional IT quotations with independent editable blocks, live preview, draft management, auto quotation numbers, templates, and PDF export.

## Stack

- React, Vite, Tailwind CSS
- Redux Toolkit
- React DnD
- Node.js, Express.js
- MongoDB, Mongoose
- html2pdf.js

## Project Structure

```text
quotation-builder/
  client/      React quotation builder UI
  server/      Express API, MongoDB schema, routes, templates
```

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The client runs on `http://localhost:5173` and the API runs on `http://localhost:5000`.

## Seed Templates

```bash
npm run seed
```

The app also ships with local frontend templates, so the builder works immediately even before MongoDB is seeded.

## Main Features

- Two-panel builder with editor and PDF-style live preview
- Independent blocks for logo, headings, company details, client details, pricing, rich overview, custom sections, footer, signature, and watermark
- Spreadsheet-style pricing table with row/column add, delete, edit, drag reorder, auto totals, and grand total
- Unlimited custom content blocks with edit, duplicate, delete, move up, move down, and drag reorder
- Default quotation templates for CRM, Shopify, website, digital marketing, and mobile app quotations
- Local draft save, update, duplicate, delete
- API endpoints for persistent quotations and templates
- Structured JSON quotation storage

