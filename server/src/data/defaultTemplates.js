import { randomUUID } from "crypto";

const defaultLogo =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="120" viewBox="0 0 420 120">
  <rect width="420" height="120" rx="18" fill="#0b2343"/>
  <path d="M47 75 70 32h22L69 75h23L80 94H40l11-19h-4Z" fill="#7dd3fc"/>
  <text x="120" y="55" fill="#ffffff" font-family="Arial" font-size="30" font-weight="700">CODEWARE</text>
  <text x="122" y="82" fill="#bfdbfe" font-family="Arial" font-size="18">IT SOLUTIONS</text>
</svg>`);

const field = (label, value = "") => ({ id: randomUUID(), label, value });
const row = (description, quantity, price) => ({
  id: randomUUID(),
  cells: {
    description,
    quantity,
    price,
    total: Number(quantity || 0) * Number(price || 0)
  }
});
const section = (heading, content) => ({ id: randomUUID(), heading, content });

const base = ({ templateType, heading, subHeading, overview, rows, sections }) => ({
  quotationNumber: "CW-2026-001",
  templateType,
  status: "draft",
  logo: { src: defaultLogo, width: 190, align: "left" },
  heading: {
    text: heading,
    subText: subHeading
  },
  companyDetails: [
    field("Company Name", "Codeware IT Solutions"),
    field("GSTIN", "27ABCDE1234F1Z5"),
    field("PAN", "ABCDE1234F"),
    field("Address", "Pune, Maharashtra, India")
  ],
  clientDetails: [
    field("Client Name", "Dr. Priya Sharma"),
    field("Company Name", "HR-Doctor Management System"),
    field("GST Number", ""),
    field("Phone", "+91 98765 43210"),
    field("Email", "contact@hrdoctor.example"),
    field("Address", "Mumbai, Maharashtra, India")
  ],
  pricing: {
    columns: [
      { id: "description", label: "Description", type: "text" },
      { id: "quantity", label: "Quantity", type: "quantity" },
      { id: "price", label: "Price", type: "currency" },
      { id: "total", label: "Total", type: "total" }
    ],
    rows
  },
  overview,
  sections,
  footer: {
    note: "Thank you for considering Codeware IT Solutions. This quotation is valid for 15 days from the date of issue.",
    signature: "",
    signatureLabel: "Authorized Signature",
    signatureEnabled: true
  },
  watermark: {
    enabled: true,
    type: "text",
    text: "CODEWARE IT",
    image: "",
    opacity: 0.05,
    rotation: -45,
    size: 450
  }
});

export const defaultTemplates = [
  {
    key: "crm-development",
    name: "CRM Development Quotation",
    description: "CRM platform quotation preloaded with HR-Doctor sample scope.",
    isDefault: true,
    quotation: base({
      templateType: "CRM Development Quotation",
      heading: "CRM DEVELOPMENT QUOTATION",
      subHeading: "(HR-Doctor Management System)",
      overview:
        "<p>This quotation covers design, development, testing, deployment, and basic onboarding for a custom CRM platform tailored for healthcare operations.</p>",
      rows: [
        row("Requirement analysis and product architecture", 1, 15000),
        row("CRM dashboard, roles, permissions, and modules", 1, 85000),
        row("Patient, doctor, HR, and workflow management", 1, 65000),
        row("Testing, deployment, and handover", 1, 25000)
      ],
      sections: [
        section(
          "Features",
          "<ul><li>Role-based dashboard for administrators and staff</li><li>Lead, client, and appointment management</li><li>Custom reports and exportable operational insights</li><li>Secure authentication and activity tracking</li></ul>"
        ),
        section(
          "Payment Terms",
          "<ol><li>40% advance to initiate the project</li><li>40% after staging approval</li><li>20% before production handover</li></ol>"
        ),
        section("Project Timeline", "<p>Estimated timeline is 8 to 10 weeks after requirement freeze and advance payment.</p>")
      ]
    })
  },
  {
    key: "shopify-website",
    name: "Shopify Website Quotation",
    description: "Shopify store setup and launch quotation.",
    isDefault: true,
    quotation: base({
      templateType: "Shopify Website Quotation",
      heading: "SHOPIFY WEBSITE QUOTATION",
      subHeading: "(E-commerce Store Setup)",
      overview:
        "<p>This quotation includes Shopify theme setup, catalog configuration, payment gateway setup, responsive pages, and launch support.</p>",
      rows: [
        row("Shopify theme customization", 1, 35000),
        row("Product catalog and collection setup", 1, 18000),
        row("Payment, shipping, and tax configuration", 1, 12000)
      ],
      sections: [
        section("Deliverables", "<ul><li>Responsive Shopify storefront</li><li>Home, product, collection, cart, and policy pages</li><li>Payment and shipping setup</li><li>Launch checklist and handover session</li></ul>"),
        section("Terms & Conditions", "<p>Third-party app, theme, and Shopify subscription charges are billed directly to the client.</p>")
      ]
    })
  },
  {
    key: "website-development",
    name: "Website Development Quotation",
    description: "Corporate website design and development quotation.",
    isDefault: true,
    quotation: base({
      templateType: "Website Development Quotation",
      heading: "WEBSITE DEVELOPMENT QUOTATION",
      subHeading: "(Corporate Website)",
      overview:
        "<p>This quotation covers a modern responsive company website with CMS-ready content sections and SEO-friendly structure.</p>",
      rows: [row("UI/UX design for key pages", 1, 22000), row("Frontend development", 1, 38000), row("Contact forms and deployment", 1, 10000)],
      sections: [
        section("Scope", "<p>Up to 8 standard website pages with responsive layouts and content placement.</p>"),
        section("Notes", "<p>Copywriting, paid plugins, hosting, and domain charges are excluded unless mentioned separately.</p>")
      ]
    })
  },
  {
    key: "digital-marketing",
    name: "Digital Marketing Quotation",
    description: "Monthly digital marketing campaign quotation.",
    isDefault: true,
    quotation: base({
      templateType: "Digital Marketing Quotation",
      heading: "DIGITAL MARKETING QUOTATION",
      subHeading: "(Monthly Growth Campaign)",
      overview:
        "<p>This quotation includes campaign planning, social media creatives, SEO activities, paid campaign support, and monthly reporting.</p>",
      rows: [row("Social media management", 1, 25000), row("SEO optimization and reporting", 1, 22000), row("Ad campaign management", 1, 18000)],
      sections: [
        section("Monthly Activities", "<ul><li>Content calendar and creative planning</li><li>On-page SEO recommendations</li><li>Campaign monitoring</li><li>Monthly performance report</li></ul>"),
        section("Exclusions", "<p>Ad spend, influencer fees, and third-party tools are not included in the service fee.</p>")
      ]
    })
  },
  {
    key: "mobile-app-development",
    name: "Mobile App Development Quotation",
    description: "Cross-platform mobile application quotation.",
    isDefault: true,
    quotation: base({
      templateType: "Mobile App Development Quotation",
      heading: "MOBILE APP DEVELOPMENT QUOTATION",
      subHeading: "(Android & iOS Application)",
      overview:
        "<p>This quotation covers product planning, mobile app design, cross-platform development, API integration, testing, and store release support.</p>",
      rows: [row("App UX/UI design", 1, 45000), row("Cross-platform mobile app development", 1, 145000), row("API integration and QA", 1, 50000)],
      sections: [
        section("App Modules", "<ul><li>User onboarding and authentication</li><li>Home dashboard and profile management</li><li>Notifications and API-based data sync</li><li>Admin-ready data structure</li></ul>"),
        section("Timeline", "<p>Estimated delivery is 10 to 14 weeks depending on final module complexity.</p>")
      ]
    })
  }
];
