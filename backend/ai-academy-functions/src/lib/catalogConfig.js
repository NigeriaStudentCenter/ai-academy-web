// Course categories, and the SharePoint course sites imported by
// siteCourses.js. To add a site: add an entry to SITE_COURSES (see the modes
// in buildSiteCourses) and add the site name to MEDIA_SITES if it isn't there.

const CATEGORIES = [
  { id: "ai-essentials", name: "AI Essentials & Tools" },
  { id: "ai-professions", name: "AI for Your Profession" },
  { id: "ai-business-ideas", name: "200 AI Business Ideas" },
  { id: "careers", name: "Careers & Employability" },
  { id: "business", name: "Business & Entrepreneurship" },
  { id: "finance", name: "Finance & Accounting" },
  { id: "personal-development", name: "Personal Development" },
  { id: "health", name: "Health & Pharmacy" },
  // AI Academy for Teens
  { id: "teens-start", name: "Start Here" },
  { id: "teens-tracks", name: "AI Tracks" },
  { id: "teens-wellbeing", name: "Wellbeing" },
];

const SITE_COURSES = [
  {
    site: "AIFinances",
    hub: "TrainingHome.aspx",
    mode: "all-pages",
    courseId: "ai-in-finance",
    title: "AI in Finance",
    description:
      "How AI really works, putting it to work on real financial data, prompt engineering for finance, building your own AI team member, and the AI-enabled CFO.",
    category: "ai-professions",
    level: "Beginner → Advanced",
  },
  {
    site: "ArtificialIntelligenceforHR",
    hub: "LearnHome.aspx",
    mode: "all-pages",
    excludePages: ["\\(1\\)\\.aspx$"], // duplicated pages
    lessonTitles: { "write-a-multimodal-prompt": "Write a Multimodal Prompt" },
    courseId: "ai-in-hr",
    title: "AI in HR",
    description:
      "Use AI across the employee journey — recruitment, learning, engagement and experience — with an HR use-case library, prompt design for HR, AI agents and an AI strategy for your HR function.",
    category: "ai-professions",
    level: "Beginner → Advanced",
  },
  {
    site: "FinancialReportigBudgetingandInternalControl",
    hub: "DepartmentHome.aspx",
    mode: "section",
    sections: ["^AI Finance"],
    courseId: "ai-finance-budgeting-forecasting",
    title: "AI Finance: Budgeting & Forecasting",
    description:
      "Generative AI fundamentals for finance, AI-assisted budgeting and forecasting, effective finance prompts, and applying AI tools to public-sector financial challenges.",
    category: "ai-professions",
  },
  {
    site: "FinancialReportigBudgetingandInternalControl",
    hub: "DepartmentHome.aspx",
    mode: "section",
    sections: ["^Module 1 Introduction", "^Module 2 Financial Reporting"],
    courseId: "ipsas-financial-reporting",
    lessonTitles: { FR1: "Module 1: Introduction to IPSAS Financial Reporting" },
    title: "IPSAS Financial Reporting",
    description:
      "The purpose and components of financial statements under IPSAS — assets, liabilities, revenues, expenses, financial instruments, consolidation, presentation and first-time adoption.",
    category: "finance",
  },
  {
    site: "FinancialReportigBudgetingandInternalControl",
    hub: "DepartmentHome.aspx",
    mode: "section",
    sections: ["Budget Preparation"],
    courseId: "ipsas-budgeting",
    title: "IPSAS Budget Preparation, Variance Analysis & Expenditure Reporting",
    description:
      "Prepare IPSAS-compliant budgets, analyse variances, report expenditure, forecast and plan strategically, and get budgets ready for review and audit.",
    category: "finance",
  },
  {
    site: "FinancialReportigBudgetingandInternalControl",
    hub: "DepartmentHome.aspx",
    mode: "section",
    sections: ["^Internal Control$"],
    courseId: "internal-control",
    title: "Internal Control",
    description: "IPSAS and internal control: why controls matter for compliance and accountability, and the components of an internal control system.",
    category: "finance",
  },
  {
    site: "StudentBusinessHub",
    hub: "Home.aspx",
    mode: "sections",
    idPrefix: "business",
    category: "business",
    skip: ["^Discover How to Grow Your Business$", "Free Text Book", "^FREE TEXT BOOKS$"],
    // Cards that point at another course's page.
    dropPages: {
      "Selling Unplugged": ["^THE-7-RULES-OF-EFFECTIVE-MARKETING"],
      "Website Conversion & Lead Capture": ["^Managing-Your-Business"],
    },
    titles: [
      ["^Marketing Unplug", "Marketing Unplugged"],
      ["^Become A professional", "Become a Professional Entrepreneur"],
      ["Think About Money", "Money Mindset: How Money Behaves"],
      ["Meta technologies", "Marketing with Meta: Facebook, Instagram & WhatsApp"],
      ["Marketing and Sales Systems", "Entrepreneur Marketing and Sales Systems"],
      ["Profit and Publicity", "Positioning Your Business for Profit and Publicity"],
      ["website into a high-converting", "Website Conversion & Lead Capture"],
      ["manage your stress", "Managing Yourself and Your Business"],
      ["Scale Your Business", "Scale Your Business"],
      ["e-commerce marketing", "E-commerce Marketing Made Easy"],
      ["right mindset", "Mindset Mastery for Entrepreneurs"],
    ],
  },
  {
    site: "StudentBusinessHub",
    hub: "Procrastination.aspx",
    courseId: "beat-procrastination",
    title: "Beat Procrastination",
    description:
      "Understand why you procrastinate and build the habits, focus, sleep, nutrition, exercise and mindfulness routines that help you get things done.",
    category: "personal-development",
  },
  {
    site: "PersonalDevelopmentCourses2",
    hub: "DepartmentHome.aspx",
    mode: "hub-of-hubs",
    idPrefix: "pd",
    category: "personal-development",
    categories: [["^Job Search", "careers"]],
    minLessons: 3,
    // Course hubs that exist but aren't linked from the home page.
    extraHubs: ["Goal-Setting-and-Getting-Things-Done.aspx", "Trust-Building-and-Resilience-Development.aspx"],
  },
  {
    site: "PersonalDevelopmentCourses2",
    hub: "DepartmentHome.aspx",
    mode: "pages",
    pages: ["Limiting-Career-Behavious.aspx"],
    courseId: "pd-limiting-career-behaviours",
    title: "Limiting Career Behaviours",
    category: "careers",
  },
  {
    site: "PharmacyAssistaantCourse",
    hub: "DepartmentHome.aspx",
    courseId: "pharmacy-assistant",
    title: "Pharmacy Assistant and Technician",
    description:
      "Prepare to work in a pharmacy: patient counselling, communication, the pharmacy team, prescriptions and dispensing, EPS and dispensing errors, inventory, SOPs, health and safety, and pharmaceutical terminology.",
    category: "health",
  },
];

// Sites whose videos, documents and images the app may stream (signed links).
const MEDIA_SITES = ["AIAcademy", ...new Set(SITE_COURSES.map((d) => d.site))];

/** Category for courses that don't set one (the built-in, SharePoint and GitHub courses). */
function categorize(course) {
  if (course.category && CATEGORIES.some((c) => c.id === course.category)) return course.category;
  const id = course.courseId || "";
  const t = course.title || "";
  if (id === "teens-ai-safety") return "teens-start";
  if (/^teens-track/.test(id)) return "teens-tracks";
  if (id === "teens-sel") return "teens-wellbeing";
  if (/^hustle-|^200-ai-business-ideas/.test(id)) return "ai-business-ideas";
  if (/cv|interview|research-a-company|job-search/i.test(id)) return "careers";
  if (/for-admins|healthcare|legal|product-management|business-analysis|data-analysts|business-marketing-sales|human-ai-sales|ai-in-hr|ai-in-finance|meta-business-agent|ai-agents-customer/i.test(id) || /in Sales|Customer Engagement/i.test(t)) {
    return "ai-professions";
  }
  return "ai-essentials";
}

module.exports = { CATEGORIES, SITE_COURSES, MEDIA_SITES, categorize };
