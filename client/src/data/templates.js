const defaultLogo =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="120" viewBox="0 0 420 120">
  <rect width="420" height="120" rx="18" fill="#0b2343"/>
  <path d="M47 75 70 32h22L69 75h23L80 94H40l11-19h-4Z" fill="#7dd3fc"/>
  <text x="120" y="55" fill="#ffffff" font-family="Arial" font-size="30" font-weight="700">CODEWARE</text>
  <text x="122" y="82" fill="#bfdbfe" font-family="Arial" font-size="18">IT SOLUTIONS</text>
</svg>`);

export const detailField = (label, value = "") => ({
  id: crypto.randomUUID(),
  label,
  value
});

export const pricingColumns = [
  { id: "description", label: "Description", type: "text" },
  { id: "quantity", label: "Quantity", type: "quantity" },
  { id: "price", label: "Price", type: "currency" },
  { id: "total", label: "Total", type: "total" }
];

export const createPricingRow = (description, quantity, price) => ({
  id: crypto.randomUUID(),
  cells: {
    description,
    quantity,
    price,
    total: Number(quantity || 0) * Number(price || 0)
  }
});

const baseCompanyDetails = [
  detailField("Company Name", "Codeware IT Solutions"),
  detailField("GSTIN", "27ABCDE1234F1Z5"),
  detailField("PAN", "ABCDE1234F"),
  detailField("Address", "Pune, Maharashtra, India")
];

const baseClientDetails = [
  detailField("Client Name", "Dr. Priya Sharma"),
  detailField("Company Name", "HR-Doctor Management System"),
  detailField("GST Number", ""),
  detailField("Phone", "+91 98765 43210"),
  detailField("Email", "contact@hrdoctor.example"),
  detailField("Address", "Mumbai, Maharashtra, India")
];

export const buildTemplate = ({
  id,
  templateType,
  heading,
  subHeading,
  overview,
  pricingRows,
  sections
}) => ({
  id,
  quotationNumber: "CW-2026-001",
  templateType,
  status: "draft",
  logo: {
    src: defaultLogo,
    width: 190,
    align: "left"
  },
  heading: {
    text: heading,
    subText: subHeading
  },
  companyDetails: baseCompanyDetails,
  clientDetails: baseClientDetails,
  pricing: {
    columns: pricingColumns,
    rows: pricingRows
  },
  overview,
  sections,
  footer: {
    note: "Thank you for considering Codeware IT Solutions. This quotation is valid for 15 days from the date of issue.",
    signature: "",
    signatureLabel: "Authorized Signature"
  },
watermark: {
  enabled: true,

  type: "text", // text | image

  text: "CODEWARE IT",

  image: "",

  opacity: 0.05,

  rotation: -45,

  size: 450
},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export const templates = [
  buildTemplate({
    id: "crm-development",
    templateType: "CRM Development Quotation",
    heading: "CRM DEVELOPMENT QUOTATION",
    subHeading: "(HR-Doctor Management System)",
    overview:
      "<p>This quotation covers design, development, testing, deployment, and basic onboarding for a custom CRM platform tailored for healthcare operations.</p>",
    pricingRows: [
      createPricingRow("Requirement analysis and product architecture", 1, 15000),
      createPricingRow("CRM dashboard, roles, permissions, and modules", 1, 85000),
      createPricingRow("Patient, doctor, HR, and workflow management", 1, 65000),
      createPricingRow("Testing, deployment, and handover", 1, 25000)
    ],
    sections: [
      {
        id: crypto.randomUUID(),
        heading: "Features",
        content:
          "<ul><li>Role-based dashboard for administrators and staff</li><li>Lead, client, and appointment management</li><li>Custom reports and exportable operational insights</li><li>Secure authentication and activity tracking</li></ul>"
      },
      {
        id: crypto.randomUUID(),
        heading: "Payment Terms",
        content:
          "<ol><li>40% advance to initiate the project</li><li>40% after staging approval</li><li>20% before production handover</li></ol>"
      },
      {
        id: crypto.randomUUID(),
        heading: "Project Timeline",
        content: "<p>Estimated timeline is 8 to 10 weeks after requirement freeze and advance payment.</p>"
      }
    ]
  }),
  buildTemplate({
    id: "shopify-website",
    templateType: "Shopify Website Quotation",
    heading: "SHOPIFY WEBSITE QUOTATION",
    subHeading: "(E-commerce Store Setup)",
    overview:
      "<p>This quotation includes Shopify theme setup, catalog configuration, payment gateway setup, responsive pages, and launch support.</p>",
    pricingRows: [
      createPricingRow("Shopify theme customization", 1, 35000),
      createPricingRow("Product catalog and collection setup", 1, 18000),
      createPricingRow("Payment, shipping, and tax configuration", 1, 12000)
    ],
    sections: [
      {
        id: crypto.randomUUID(),
        heading: "Deliverables",
        content:
          "<ul><li>Responsive Shopify storefront</li><li>Home, product, collection, cart, and policy pages</li><li>Payment and shipping setup</li><li>Launch checklist and handover session</li></ul>"
      },
      {
        id: crypto.randomUUID(),
        heading: "Terms & Conditions",
        content: "<p>Third-party app, theme, and Shopify subscription charges are billed directly to the client.</p>"
      }
    ]
  }),
  buildTemplate({
    id: "website-development",
    templateType: "Website Development Quotation",
    heading: "WEBSITE DEVELOPMENT QUOTATION",
    subHeading: "(Corporate Website)",
    overview:
      "<p>This quotation covers a modern responsive company website with CMS-ready content sections and SEO-friendly structure.</p>",
    pricingRows: [
      createPricingRow("UI/UX design for key pages", 1, 22000),
      createPricingRow("Frontend development", 1, 38000),
      createPricingRow("Contact forms and deployment", 1, 10000)
    ],
    sections: [
      {
        id: crypto.randomUUID(),
        heading: "Scope",
        content: "<p>Up to 8 standard website pages with responsive layouts and content placement.</p>"
      },
      {
        id: crypto.randomUUID(),
        heading: "Notes",
        content: "<p>Copywriting, paid plugins, hosting, and domain charges are excluded unless mentioned separately.</p>"
      }
    ]
  }),
  buildTemplate({
    id: "digital-marketing",
    templateType: "Digital Marketing Quotation",
    heading: "DIGITAL MARKETING QUOTATION",
    subHeading: "(Monthly Growth Campaign)",
    overview:
      "<p>This quotation includes campaign planning, social media creatives, SEO activities, paid campaign support, and monthly reporting.</p>",
    pricingRows: [
      createPricingRow("Social media management", 1, 25000),
      createPricingRow("SEO optimization and reporting", 1, 22000),
      createPricingRow("Ad campaign management", 1, 18000)
    ],
    sections: [
      {
        id: crypto.randomUUID(),
        heading: "Monthly Activities",
        content:
          "<ul><li>Content calendar and creative planning</li><li>On-page SEO recommendations</li><li>Campaign monitoring</li><li>Monthly performance report</li></ul>"
      },
      {
        id: crypto.randomUUID(),
        heading: "Exclusions",
        content: "<p>Ad spend, influencer fees, and third-party tools are not included in the service fee.</p>"
      }
    ]
  }),
  buildTemplate({
    id: "mobile-app-development",
    templateType: "Mobile App Development Quotation",
    heading: "MOBILE APP DEVELOPMENT QUOTATION",
    subHeading: "(Android & iOS Application)",
    overview:
      "<p>This quotation covers product planning, mobile app design, cross-platform development, API integration, testing, and store release support.</p>",
    pricingRows: [
      createPricingRow("App UX/UI design", 1, 45000),
      createPricingRow("Cross-platform mobile app development", 1, 145000),
      createPricingRow("API integration and QA", 1, 50000)
    ],
    sections: [
      {
        id: crypto.randomUUID(),
        heading: "App Modules",
        content:
          "<ul><li>User onboarding and authentication</li><li>Home dashboard and profile management</li><li>Notifications and API-based data sync</li><li>Admin-ready data structure</li></ul>"
      },
      {
        id: crypto.randomUUID(),
        heading: "Timeline",
        content: "<p>Estimated delivery is 10 to 14 weeks depending on final module complexity.</p>"
      }
    ]
  })
];

export const getTemplateById = (id) => templates.find((template) => template.id === id) || templates[0];
