import { PrismaClient, type Prisma } from "@prisma/client";
import type { LocalizedText } from "../src/utils/localized";

const prisma = new PrismaClient();

const text = (en: string, fa: string): LocalizedText => ({ en, fa });

const same = (value: string) => text(value, value);

function bullets(items: Array<[string, string]>): LocalizedText {
  const list = (index: 0 | 1) =>
    `<ul>${items.map((item) => `<li>${item[index]}</li>`).join("")}</ul>`;
  return { en: list(0), fa: list(1) };
}

function article(
  blocks: Array<{ h?: [string, string]; p?: [string, string]; items?: Array<[string, string]> }>,
): LocalizedText {
  const render = (index: 0 | 1) =>
    blocks
      .map((block) => {
        if (block.h) return `<h2>${block.h[index]}</h2>`;
        if (block.p) return `<p>${block.p[index]}</p>`;
        if (block.items) {
          return `<ul>${block.items.map((item) => `<li>${item[index]}</li>`).join("")}</ul>`;
        }
        return "";
      })
      .join("");
  return { en: render(0), fa: render(1) };
}

const tech = (names: string[]) =>
  names.map((name, sortOrder) => ({ name: same(name), sortOrder }));

const basicInfo: Array<{ key: string; value: LocalizedText }> = [
  { key: "name", value: text("Ramtin Shakeri", "رامتین شاکری") },
  { key: "title", value: text("Software Engineer", "مهندس نرم‌افزار") },
  { key: "email", value: same("r.shakeri1375@gmail.com") },
  { key: "phone", value: same("+98 919 084 8501") },
  { key: "github", value: same("https://github.com/shakerii") },
  { key: "location", value: text("Tehran, Iran", "تهران، ایران") },
  {
    key: "summary",
    value: text(
      "Full-stack Software Engineer with 7+ years of experience building AI-driven applications, scalable platforms, and user-focused web solutions. Experienced in leading teams, designing architecture, and delivering production-grade systems with modern stacks.",
      "مهندس نرم‌افزار فول‌استک با بیش از ۷ سال تجربه در ساخت اپلیکیشن‌های مبتنی بر هوش مصنوعی، پلتفرم‌های مقیاس‌پذیر و راهکارهای وب کاربرمحور. تجربه در رهبری تیم، طراحی معماری و تحویل سیستم‌های آماده تولید با فناوری‌های مدرن.",
    ),
  },
];

const experiences: Array<{
  company: LocalizedText;
  role: LocalizedText;
  period: LocalizedText;
  description: LocalizedText;
}> = [
  {
    company: text("Farbonyan", "فربنیان"),
    role: text("Full-Stack & AI Developer", "توسعه‌دهنده فول‌استک و هوش مصنوعی"),
    period: text("Feb 2024 – Present", "فوریه ۲۰۲۴ – اکنون"),
    description: bullets([
      [
        "Build AI-assisted analysis and reporting products with LangChain and Next.js, and dashboards that let non-technical staff read company data directly.",
        "محصول‌های تحلیل و گزارش‌گیری مبتنی بر هوش مصنوعی را با LangChain و Next.js می‌سازم، همراه با داشبوردهایی که کارکنان غیرفنی داده شرکت را مستقیم می‌خوانند.",
      ],
      [
        "The work splits about 40% frontend, 30% backend, and 30% AI and data.",
        "تقسیم کار حدود ۴۰٪ فرانت‌اند، ۳۰٪ بک‌اند و ۳۰٪ هوش مصنوعی و داده است.",
      ],
      [
        "Delivered a B2B commerce platform for automotive parts, a holding-wide reporting system on a nightly data warehouse, and a conversational business-intelligence assistant.",
        "پلتفرم فروش B2B قطعات خودرو، سامانه گزارش‌گیری هلدینگ روی انبار داده شبانه، و دستیار گفتگومحور هوش تجاری را تحویل دادم.",
      ],
    ]),
  },
  {
    company: text("Interactive 10 (Remote)", "اینتراکتیو ۱۰ (دورکاری)"),
    role: text("CTO & Software Engineer", "مدیر فناوری و مهندس نرم‌افزار"),
    period: text("Jun 2022 – Feb 2024", "ژوئن ۲۰۲۲ – فوریه ۲۰۲۴"),
    description: bullets([
      [
        "Led a distributed team delivering SaaS products for interactive-media and real-estate clients.",
        "تیم توزیع‌شده‌ای را رهبری کردم و محصول‌های SaaS را برای مشتریان رسانه تعاملی و املاک تحویل دادم.",
      ],
      [
        "Shipped a Next.js, tRPC, and Prisma web app, a React Native client, and a command-based collector for listings on Rightmove, Zoopla, PropertyFinder, Bayut, Dubizzle, and DxbInteract.",
        "وب‌اپ Next.js و tRPC و Prisma، کلاینت React Native، و گردآورنده آگهی از Rightmove و Zoopla و PropertyFinder و Bayut و Dubizzle و DxbInteract را تحویل دادم.",
      ],
      [
        "Introduced CI/CD and containerized backend services and shortened the release cycle by about 70%.",
        "CI/CD و سرویس‌های بک‌اند کانتینری را راه انداختم و چرخه انتشار را حدود ۷۰٪ کوتاه کردم.",
      ],
      [
        "Led two frontend developers, a designer, and a marketing partner, and owned requirements, planning, and full-stack delivery.",
        "دو توسعه‌دهنده فرانت‌اند، یک طراح و یک همکار بازاریابی را هدایت کردم و نیازها، برنامه‌ریزی و تحویل فول‌استک را خودم بر عهده داشتم.",
      ],
    ]),
  },
  {
    company: text("Matap", "متاپ"),
    role: text("CTO & Full-Stack Developer", "مدیر فناوری و توسعه‌دهنده فول‌استک"),
    period: text("Mar 2022 – Jun 2022", "مارس ۲۰۲۲ – ژوئن ۲۰۲۲"),
    description: bullets([
      [
        "Designed the architecture for a clinic platform covering appointment booking and medicine prescriptions.",
        "معماری پلتفرمی برای نوبت‌دهی درمانگاه و نسخه دارو را طراحی کردم.",
      ],
      [
        "Led a designer and two frontend developers and implemented the core backend in NestJS.",
        "یک طراح و دو توسعه‌دهنده فرانت‌اند را رهبری کردم و بک‌اند اصلی را با NestJS پیاده کردم.",
      ],
    ]),
  },
  {
    company: text("Freelance", "فریلنس"),
    role: text("Full-Stack Developer", "توسعه‌دهنده فول‌استک"),
    period: text("2020 – 2022", "۲۰۲۰ – ۲۰۲۲"),
    description: bullets([
      [
        "Delivered custom web applications for clients with React, Node.js, and PHP/Laravel.",
        "اپلیکیشن‌های وب سفارشی را برای مشتریان با React و Node.js و PHP/Laravel تحویل دادم.",
      ],
      [
        "Took early products through implementation, including a stock-prediction neural network, a coffee-bean distribution platform, and a learning website.",
        "محصول‌های اولیه را تا پیاده‌سازی پیش بردم، از جمله یک شبکه عصبی پیش‌بینی سهام، یک پلتفرم توزیع دانه قهوه، و یک وب‌سایت آموزشی.",
      ],
    ]),
  },
  {
    company: text("Raymon Co.", "شرکت رایمون"),
    role: text("WordPress & React Developer", "توسعه‌دهنده وردپرس و React"),
    period: text("2019 – 2020", "۲۰۱۹ – ۲۰۲۰"),
    description: bullets([
      [
        "Started a B2B admin for FMCG products as a WooCommerce MVP and a custom plugin.",
        "پنل B2B کالاهای تندمصرف را با MVP ووکامرس و یک افزونه سفارشی شروع کردم.",
      ],
      [
        "Moved the product to React within a month and built the admin panel and the customer panel alongside a dedicated backend developer.",
        "ظرف یک ماه محصول را به React بردم و پنل مدیریت و پنل مشتریان را در کنار یک توسعه‌دهنده بک‌اند ساختم.",
      ],
    ]),
  },
  {
    company: text("Tinext Co.", "شرکت تی‌نکست"),
    role: text("Laravel Developer", "توسعه‌دهنده Laravel"),
    period: text("2018", "۲۰۱۸"),
    description: bullets([
      [
        "Built an online order-tracking application with HTML, CSS, JavaScript, and PHP, then continued the product in Laravel.",
        "سامانه پیگیری سفارش آنلاین را با HTML و CSS و JavaScript و PHP ساختم و سپس محصول را با Laravel ادامه دادم.",
      ],
    ]),
  },
  {
    company: text("Amirkabir IoT Lab", "آزمایشگاه اینترنت اشیاء امیرکبیر"),
    role: text("Research & Development", "تحقیق و توسعه"),
    period: text("2016 – 2017", "۲۰۱۶ – ۲۰۱۷"),
    description: bullets([
      [
        "On the university IoT team, built a Flask service that logged smart-home events.",
        "در تیم اینترنت اشیاء دانشگاه، سرویسی با Flask برای ثبت رویدادهای خانه هوشمند ساختم.",
      ],
      [
        "Designed a system meant to coordinate a large number of in-home devices.",
        "سیستمی طراحی کردم که قرار بود تعداد زیادی دستگاه داخل خانه را هماهنگ کند.",
      ],
    ]),
  },
];

const projects: Array<{
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText;
  technologies: ReturnType<typeof tech>;
}> = [
  {
    slug: "sabi",
    title: text(
      "SABI — Smart Assistant for Business Intelligence",
      "SABI — دستیار هوشمند هوش تجاری",
    ),
    excerpt: text(
      "Conversational assistant that answers questions about company data with charts, tables, and written analysis, under row-level access control.",
      "دستیار گفتگومحور که به سؤال‌ها درباره داده شرکت با نمودار، جدول و تحلیل نوشتاری جواب می‌دهد، با کنترل دسترسی در سطح ردیف.",
    ),
    technologies: tech([
      "LangChain",
      "LangGraph",
      "Next.js",
      "tRPC",
      "FastAPI",
      "Redis",
      "Docker",
    ]),
    content: article([
      { h: ["Overview", "معرفی"] },
      {
        p: [
          "SABI is a business assistant. Employees ask questions in chat and receive text, audio, tables, and charts. A question about sales, for example, produces a chart and then an explanation of it. Each company supplies its own instructions for how calculations should be done, and the assistant follows those definitions instead of inventing business rules.",
          "SABI یک دستیار کسب‌وکار است. کارکنان در گفتگو سؤال می‌پرسند و متن، صوت، جدول و نمودار می‌گیرند. مثلاً سؤال درباره فروش، یک نمودار و بعد توضیح آن را می‌سازد. هر شرکت دستور خودش را برای نحوه محاسبه می‌دهد و دستیار به همان تعریف‌ها تکیه می‌کند، نه به قواعدی که خودش بسازد.",
        ],
      },
      { h: ["What shipped", "آنچه تحویل شد"] },
      {
        items: [
          ["Chat-based report builder that keeps the thread and updates the current report.", "گزارش‌ساز گفتگومحور که رشته مکالمه را نگه می‌دارد و گزارش جاری را به‌روز می‌کند."],
          ["Report generator for tables, charts, and written analysis.", "مولد گزارش برای جدول، نمودار و تحلیل نوشتاری."],
          ["Permission control and a knowledge graph of company documents.", "کنترل دسترسی و گراف دانش از سندهای شرکت."],
          ["Calendar management, file upload, and multiple languages.", "مدیریت تقویم، بارگذاری فایل و چند زبان."],
          ["Personal reports that a user can save and pin to a dashboard.", "گزارش‌های شخصی که کاربر ذخیره می‌کند و به داشبورد سنجاق می‌کند."],
        ],
      },
      { h: ["Model and tools", "مدل و ابزارها"] },
      {
        p: [
          "The assistant runs Llama 4 Maverick, chosen because the model had to be small enough to download and run locally. LangChain and LangGraph decide whether the user is permitted to ask and whether the question is in scope. The shipped flow uses tools for database queries, notifications, and report creation. Every step returns structured output. Retrieval-augmented generation covers entity search and knowledge-graph search. An agent loop was designed and left for a later iteration.",
          "دستیار روی Llama 4 Maverick اجرا می‌شود، چون مدل باید آن‌قدر کوچک می‌بود که دانلود و محلی اجرا شود. LangChain و LangGraph تصمیم می‌گیرند کاربر اجازه پرسش دارد یا نه و سؤال در محدوده است یا نه. جریان تحویل‌شده از ابزار برای پرس‌وجوی پایگاه داده، اعلان و ساخت گزارش استفاده می‌کند. هر گام خروجی ساخت‌یافته برمی‌گرداند. تولید تقویت‌شده با بازیابی، جستجوی موجودیت و گراف دانش را پوشش می‌دهد. حلقه عامل طراحی شد و برای مرحله بعد ماند.",
        ],
      },
      { h: ["Querying data", "پرس‌وجوی داده"] },
      {
        p: [
          "A question moves from the model to a scope, then to the tables in that scope, then through schema understanding, SQL generation, validation, execution, and visualization. A rules table stores how each source table should be queried, and the user chooses the database. Safety was enforced with those rules and by rewriting filters to the row IDs each user can access. The next step is to have the model emit a pivot specification, using the report builder already in production, instead of free-form SQL.",
          "سؤال از مدل به یک محدوده می‌رود، بعد به جدول‌های همان محدوده، بعد فهم شما، تولید SQL، اعتبارسنجی، اجرا و مصورسازی. یک جدول قواعد می‌گوید هر جدول منبع چطور پرس‌وجو شود و کاربر پایگاه داده را انتخاب می‌کند. ایمنی با همان قواعد و با بازنویسی فیلترها روی شناسه ردیف‌هایی که کاربر به آن‌ها دسترسی دارد اعمال شد. گام بعد این است که مدل به‌جای SQL آزاد، ساختار یک جدول محوری بدهد و از گزارش‌سازی که همین حالا در محصول است استفاده کند.",
        ],
      },
      { h: ["Knowledge graph", "گراف دانش"] },
      {
        p: [
          "Uploaded PDF, Word, and text files are split into paragraphs. A prompt extracts nodes and relations from each paragraph. Node types are concept, definition, formula, entity, and purpose. Purposes are context, query, visualization, and analysis. Relations are includes, excludes, dependent, same as, related to, and mapped to. The graph is stored locally and consulted in an early LangGraph step. In testing it supplied the accounting definitions the model did not already have. The planned follow-up is to expose the graph as a tool in an agent flow.",
          "فایل‌های PDF و Word و متن به بند تقسیم می‌شوند. یک پرامپت از هر بند گره و رابطه استخراج می‌کند. نوع گره‌ها مفهوم، تعریف، فرمول، موجودیت و هدف است. هدف‌ها زمینه، پرس‌وجو، مصورسازی و تحلیل‌اند. رابطه‌ها شامل، مستثنی، وابسته، یکسان، مرتبط و نگاشت‌شده است. گراف محلی ذخیره می‌شود و در یکی از گام‌های ابتدایی LangGraph خوانده می‌شود. در آزمون، تعریف‌های حسابداری را که مدل از قبل نداشت تأمین کرد. ادامه کار این است که گراف به‌صورت یک ابزار در جریان عاملی در دسترس باشد.",
        ],
      },
      { h: ["Access control", "کنترل دسترسی"] },
      {
        p: [
          "The system reads the database schema, and an administrator marks tables as permission-bearing. Those tables appear on the user form. Every later query checks both the allowed tables and the allowed rows.",
          "سیستم شمای پایگاه داده را می‌خواند و مدیر برخی جدول‌ها را به‌عنوان مجوز علامت می‌زند. همان جدول‌ها روی فرم کاربر ظاهر می‌شوند. هر پرس‌وجوی بعدی هم جدول مجاز و هم ردیف مجاز را بررسی می‌کند.",
        ],
      },
    ]),
  },
  {
    slug: "fis",
    title: text("FIS — Farbonyan Intelligent Sales", "FIS — فروش هوشمند فربنیان"),
    excerpt: text(
      "Next.js B2B platform for automotive-parts sales, inventory, and shipment, with access-controlled tabs and a virtualized data table for very large catalogs.",
      "پلتفرم B2B با Next.js برای فروش، موجودی و حمل قطعات خودرو، با تب‌های کنترل‌شده با دسترسی و جدول داده مجازی برای کاتالوگ‌های بسیار بزرگ.",
    ),
    technologies: tech([
      "Next.js",
      "React",
      "TypeScript",
      "TanStack Table",
      "TanStack Query",
      "shadcn",
      "REST",
      "Docker",
      "Flask",
      "PyTorch",
    ]),
    content: article([
      { h: ["Platform", "پلتفرم"] },
      {
        p: [
          "FIS is the frontend for B2B sales of automotive parts, including inventory and shipment. It supports hundreds of SKUs and about 200 vendors, of which about 20 are active. The interface is a tabbed workspace: menus and options follow access rights, and a customizable dashboard sits on top. Opening a menu, or any action that needs another view, calls useTabOpener with props validated by Zod.",
          "FIS فرانت‌اند فروش B2B قطعات خودرو است، شامل موجودی و حمل. صدها کالا و حدود ۲۰۰ فروشنده را پوشش می‌دهد که حدود ۲۰ تای آن‌ها فعال‌اند. رابط یک فضای کاری تب‌دار است: منوها و گزینه‌ها تابع دسترسی‌اند و یک داشبورد قابل تنظیم روی آن قرار دارد. باز کردن منو، یا هر عملی که نمای دیگری بخواهد، useTabOpener را با ویژگی‌هایی صدا می‌زند که Zod اعتبارسنجی می‌کند.",
        ],
      },
      { h: ["Frontend", "فرانت‌اند"] },
      {
        p: [
          "The app is Next.js and React 19 with TypeScript and TanStack Query. Application state lives in React context. The interface is shadcn, extended for right-to-left layout and for components the product needed beyond the defaults. There is no separate UI kit and no Zustand or Redux.",
          "برنامه Next.js و React 19 با TypeScript و TanStack Query است. وضعیت برنامه در React context است. رابط shadcn است و برای راست‌به‌چپ و برای جزءهایی که محصول علاوه بر پیش‌فرض‌ها لازم داشت گسترش یافته است. کیت رابط جدا و Zustand یا Redux در کار نیست.",
        ],
      },
      { h: ["Data table", "جدول داده"] },
      {
        items: [
          [
            "Global and column search, sorting, pagination, column order, size, pinning, and visibility.",
            "جستجوی سراسری و ستونی، مرتب‌سازی، صفحه‌بندی، ترتیب و اندازه و سنجاق و نمایش ستون‌ها.",
          ],
          [
            "Row actions, batch actions, global actions, selection, and export to Excel and PDF.",
            "عملیات ردیف، عملیات دسته‌ای، عملیات سراسری، انتخاب و خروجی Excel و PDF.",
          ],
          [
            "Tree data, multi-level grouping, and aggregations: count, sum, mean, max, and min.",
            "داده درختی، گروه‌بندی چندسطحی و تجمیع: تعداد، جمع، میانگین، بیشینه و کمینه.",
          ],
          [
            "Client-side virtualization for more than 100,000 rows on one page. Columns are supplied per table, and a few screens edit cells inline.",
            "مجازی‌سازی سمت کلاینت برای بیش از ۱۰۰هزار ردیف در یک صفحه. ستون‌ها برای هر جدول جدا داده می‌شوند و چند صفحه سلول را درجا ویرایش می‌کنند.",
          ],
        ],
      },
      { h: ["Attribute extraction", "استخراج ویژگی"] },
      {
        p: [
          "A separate Flask and PyTorch service reads a Persian part name and predicts attributes that merchandisers define in the admin panel. The network was trained on the catalog itself, about 2,000 parts, after a token search seeded the first labels. It returns a list of predicted attributes. On that set it reached roughly 70% accuracy, and it runs beside the main application rather than inside it.",
          "یک سرویس جدا با Flask و PyTorch نام فارسی قطعه را می‌خواند و ویژگی‌هایی را پیش‌بینی می‌کند که مسئول کالا در پنل مدیریت تعریف کرده است. شبکه روی خود کاتالوگ آموزش دید، حدود ۲۰۰۰ قطعه، بعد از اینکه یک جستجوی توکنی برچسب‌های اول را پر کرد. خروجی فهرستی از ویژگی‌های پیش‌بینی‌شده است. روی همان مجموعه دقت حدود ۷۰٪ بود و سرویس کنار برنامه اصلی اجرا می‌شود، نه داخل آن.",
        ],
      },
    ]),
  },
  {
    slug: "hms",
    title: text("HMS — Holding Management System", "HMS — سامانه مدیریت هلدینگ"),
    excerpt: text(
      "Holding dashboard over a nightly MSSQL warehouse, with pivot reports, charts, and a generator that scaffolds models, forms, and tRPC APIs.",
      "داشبورد هلدینگ روی انبار داده شبانه MSSQL، با گزارش محوری، نمودار، و مولدی که مدل، فرم و APIهای tRPC را می‌سازد.",
    ),
    technologies: tech(["Next.js", "tRPC", "Prisma", "MSSQL", "Mustache"]),
    content: article([
      { h: ["Warehouse", "انبار داده"] },
      {
        p: [
          "HMS is the admin dashboard for a holding company. Subsidiary systems are almost all MSSQL. One SAP source is identified and not yet connected. A nightly SQL job copies the data. One client's warehouse is about 1 TB and is synchronized every night.",
          "HMS داشبورد مدیریت یک شرکت هلدینگ است. سامانه‌های شرکت‌های زیرمجموعه تقریباً همه MSSQL هستند. یک منبع SAP مشخص شده و هنوز وصل نشده است. یک SQL job شبانه داده را کپی می‌کند. انبار داده یکی از مشتری‌ها حدود ۱ ترابایت است و هر شب همگام می‌شود.",
        ],
      },
      { h: ["Pivot reporting", "گزارش محوری"] },
      {
        p: [
          "Analysts pick dimensions and measures and build a report without an engineer. Dimensions cover filters, rows, values, and groups. Aggregations are sum, average, count, minimum, and maximum. A filter can stay as a default or move onto the fetch form. Calculated fields are not supported. Results export through the shared data table. Charts take the x-axis from rows and the y-axis from values, and can group by the remaining row fields.",
          "تحلیلگر بُعد و سنجه را انتخاب می‌کند و بدون مهندس گزارش می‌سازد. بُعدها فیلتر، ردیف، مقدار و گروه را پوشش می‌دهند. تجمیع‌ها جمع، میانگین، تعداد، کمینه و بیشینه است. فیلتر می‌تواند پیش‌فرض بماند یا به فرم دریافت گزارش برود. فیلد محاسباتی پشتیبانی نمی‌شود. خروجی از همان جدول داده مشترک می‌گذرد. نمودار محور افقی را از ردیف‌ها و محور عمودی را از مقدارها می‌گیرد و می‌تواند بر اساس بقیه فیلدهای ردیف گروه شود.",
        ],
      },
      { h: ["Query builder", "سازنده پرس‌وجو"] },
      {
        p: [
          "A Next.js and tRPC form describes a dynamic query. The filter form feeds a generator that handles joins, selected columns, aggregation, and multistep queries. The generator opens the table with its initial grouping and ordering, and it offers the charts that can be drawn from that result.",
          "یک فرم Next.js و tRPC پرس‌وجوی پویا را توصیف می‌کند. فرم فیلتر به مولدی می‌رسد که الحاق، ستون‌های انتخاب‌شده، تجمیع و پرس‌وجوی چندمرحله‌ای را انجام می‌دهد. مولد جدول را با گروه‌بندی و ترتیب اولیه باز می‌کند و نمودارهایی را پیشنهاد می‌دهد که از همان نتیجه رسم می‌شوند.",
        ],
      },
      { h: ["Code generator", "مولد کد"] },
      {
        p: [
          "A Mustache generator emits a base model, such as a user or a product, together with its list view, create and update forms, delete API, and the matching tRPC procedures. With many base models in the holding system, that scaffolding removed about three months of repetitive work.",
          "یک مولد Mustache مدل پایه را، مثل کاربر یا محصول، همراه با نمای فهرست، فرم ایجاد و ویرایش، API حذف و روال‌های tRPC متناظر تولید می‌کند. با تعداد زیاد مدل پایه در سامانه هلدینگ، این اسکلت حدود سه ماه کار تکراری را برداشت.",
        ],
      },
    ]),
  },
  {
    slug: "real-estate-data",
    title: text("Real Estate Data Platform", "پلتفرم داده املاک"),
    excerpt: text(
      "Next.js and React Native product that saves property listings from major portals on command, then extracts structured data with a trained scraper.",
      "محصول Next.js و React Native که آگهی ملک را از درگاه‌های اصلی با فرمان کاربر ذخیره می‌کند و بعد داده ساخت‌یافته را با یک خراش‌گر آموزش‌دیده استخراج می‌کند.",
    ),
    technologies: tech([
      "Next.js",
      "tRPC",
      "Prisma",
      "PlanetScale",
      "React Native",
      "next-auth",
      "Docker",
      "Python",
      "AutoScraper",
    ]),
    content: article([
      { h: ["Product", "محصول"] },
      {
        p: [
          "The platform collects property listings for users from Rightmove, Zoopla, PropertyFinder, Bayut, Dubizzle, and DxbInteract. Collection is command-based: nothing is crawled in bulk. The user saves a listing, and the system stores that page.",
          "پلتفرم آگهی ملک را برای کاربر از Rightmove و Zoopla و PropertyFinder و Bayut و Dubizzle و DxbInteract جمع می‌کند. جمع‌آوری فرمانی است: خزش انبوه انجام نمی‌شود. کاربر یک آگهی را ذخیره می‌کند و سیستم همان صفحه را نگه می‌دارد.",
        ],
      },
      { h: ["Architecture", "معماری"] },
      {
        p: [
          "The stack is Next.js, tRPC, Node, and Prisma on PlanetScale (MySQL). The app is hosted on Vercel, containerized with Docker, and released through Vercel's CI/CD. Authentication is next-auth. Background fetching runs as a Vercel job. Queues are stored in the database rather than in a separate broker.",
          "پشته Next.js، tRPC، Node و Prisma روی PlanetScale (MySQL) است. برنامه روی Vercel میزبانی می‌شود، با Docker کانتینر شده و از CI/CD خود Vercel منتشر می‌شود. احراز هویت next-auth است. دریافت پس‌زمینه یک job در Vercel است. صف‌ها در پایگاه داده ذخیره می‌شوند، نه در یک کارگزار جدا.",
        ],
      },
      { h: ["How a save works", "نحوه ذخیره"] },
      {
        items: [
          [
            "In the mobile app, a webview injects a Vite-built script that adds a save button to each property and posts the HTML to the backend.",
            "در اپ موبایل، یک webview اسکریپتی را تزریق می‌کند که با Vite ساخته شده، روی هر ملک دکمه ذخیره می‌گذارد و HTML را به بک‌اند می‌فرستد.",
          ],
          [
            "On the web, a Plasmo extension detects the same sites and adds the same button.",
            "در وب، یک افزونه Plasmo همان سایت‌ها را تشخیص می‌دهد و همان دکمه را اضافه می‌کند.",
          ],
          [
            "A Python worker reads the HTML and extracts fields with AutoScraper, trained on sample pages from those portals. The page structures stayed stable enough for that approach.",
            "یک کارگر پایتون HTML را می‌خواند و فیلدها را با AutoScraper استخراج می‌کند که روی صفحه‌های نمونه همان درگاه‌ها آموزش دیده است. ساختار صفحه‌ها به‌اندازه کافی پایدار ماند.",
          ],
        ],
      },
    ]),
  },
  {
    slug: "clinic-platform",
    title: text("Clinic Reservation Platform", "پلتفرم نوبت‌دهی درمانگاه"),
    excerpt: text(
      "Architecture and NestJS backend for appointment booking and medicine prescriptions, delivered with a designer and two frontend developers.",
      "معماری و بک‌اند NestJS برای نوبت‌دهی و نسخه دارو، با یک طراح و دو توسعه‌دهنده فرانت‌اند.",
    ),
    technologies: tech(["NestJS", "TypeScript", "Node.js"]),
    content: article([
      { h: ["Scope", "محدوده"] },
      {
        p: [
          "Matap needed a system for booking doctors and issuing medicine prescriptions, and a backend that could also serve other B2B web products. I set the architecture, led a designer and two frontend developers, and implemented the core services in NestJS.",
          "متاپ به سامانه‌ای برای رزرو پزشک و صدور نسخه دارو نیاز داشت، و به بک‌اندی که بتواند محصول‌های وب B2B دیگر را هم سرویس بدهد. معماری را چیدم، یک طراح و دو توسعه‌دهنده فرانت‌اند را رهبری کردم و سرویس‌های اصلی را با NestJS پیاده کردم.",
        ],
      },
    ]),
  },
  {
    slug: "smart-catalog",
    title: text("Smart Catalog Builder", "سازنده کاتالوگ هوشمند"),
    excerpt: text(
      "Drag-and-drop studio for interactive product catalogs, with live preview, animations, and PDF export, embedded on a customer's site through an iframe.",
      "استودیوی کشیدن و رها کردن برای کاتالوگ محصول تعاملی، با پیش‌نمایش زنده، انیمیشن و خروجی PDF، که با iframe در سایت مشتری قرار می‌گیرد.",
    ),
    technologies: tech(["Next.js", "tRPC", "DND-kit", "Tailwind CSS", "PostgreSQL", "Docker"]),
    content: article([
      { h: ["Product", "محصول"] },
      {
        p: [
          "A company designs an online catalog and shares a link. That link renders inside an iframe on the company's own site. Every component can be dragged onto a page. Components have enter and exit animations, and actions that open another component, another catalog page, or an external URL. Each catalog has an image and video gallery and can be exported as a PDF.",
          "شرکت یک کاتالوگ آنلاین طراحی می‌کند و یک پیوند به اشتراک می‌گذارد. آن پیوند داخل iframe در سایت خود شرکت نمایش داده می‌شود. هر جزء را می‌توان روی صفحه کشید. اجزا انیمیشن ورود و خروج دارند و عملی که جزء دیگر، صفحه دیگر کاتالوگ، یا یک نشانی بیرونی را باز می‌کند. هر کاتالوگ گالری تصویر و ویدیو دارد و به PDF خروجی گرفته می‌شود.",
        ],
      },
      { h: ["How the designer stores a page", "نحوه ذخیره صفحه"] },
      {
        p: [
          "The user uploads images and drops them onto each page. Editing a component changes its attributes, including shadow and animation. A drop updates the image id and the x and y position as percentages. In Postgres, a catalog has many pages and each page has many components. The layout is rows, not a JSON document. There is no separate render step: images load with the page, related pages are preloaded, and the preview updates as attributes change. tRPC was used for end-to-end types. The service was packaged with Docker. It was ready to deploy and did not reach a public launch.",
          "کاربر تصویر بارگذاری می‌کند و آن‌ها را روی هر صفحه می‌اندازد. ویرایش جزء، ویژگی‌هایش را عوض می‌کند، از جمله سایه و انیمیشن. رها کردن، شناسه تصویر و موقعیت افقی و عمودی را به‌صورت درصد به‌روز می‌کند. در Postgres هر کاتالوگ چند صفحه دارد و هر صفحه چند جزء. چیدمان ردیف است، نه یک سند JSON. مرحله رندر جدا وجود ندارد: تصویرها با صفحه می‌آیند، صفحه‌های مرتبط از قبل بارگذاری می‌شوند و پیش‌نمایش با تغییر ویژگی‌ها به‌روز می‌شود. tRPC برای نوع سرتاسری انتخاب شد. سرویس با Docker بسته‌بندی شد. برای استقرار آماده بود و به عرضه عمومی نرسید.",
        ],
      },
    ]),
  },
  {
    slug: "ping-enhancement",
    title: text("Ping Enhancement", "بهبود پینگ"),
    excerpt: text(
      "Golang router that rewrites game routes, with policies for play, voice, and chat, and a FastAPI service that stores logs in MongoDB.",
      "مسیریاب Go که مسیر بازی را بازنویسی می‌کند، با سیاست بازی و صدا و گفتگو، و سرویس FastAPI که لاگ را در MongoDB نگه می‌دارد.",
    ),
    technologies: tech(["Go", "FastAPI", "MongoDB", "WireGuard", "sing-box"]),
    content: article([
      { h: ["System", "سامانه"] },
      {
        p: [
          "The product improves game latency by sending the player's traffic through a router. Go runs on the routers and rewrites routes. Operators choose the route. A FastAPI service stores logs in MongoDB. Games are added over time. Transport is WireGuard, with sing-box on the client. Voice and chat move as ordinary packets.",
          "محصول تأخیر بازی را با عبور ترافیک بازیکن از یک مسیریاب کم می‌کند. Go روی مسیریاب‌ها اجرا می‌شود و مسیر را بازنویسی می‌کند. انتخاب مسیر با اپراتور است. یک سرویس FastAPI لاگ‌ها را در MongoDB ذخیره می‌کند. بازی‌ها به‌مرور اضافه می‌شوند. انتقال با WireGuard است و sing-box روی کلاینت. صدا و گفتگو مثل بقیه بسته‌ها جابه‌جا می‌شوند.",
        ],
      },
      { h: ["Policies", "سیاست‌ها"] },
      {
        p: [
          "Before a connection is established, policy covers whether the game is active, whether the user is active, and whether that user may play, speak, or use chat. Intercepting traffic so those checks run on the path was specified and was still in progress. I led one backend developer and one frontend developer: requirements, tasks, meetings, and technical support.",
          "پیش از برقراری اتصال، سیاست مشخص می‌کند بازی فعال است یا نه، کاربر فعال است یا نه، و آیا آن کاربر اجازه بازی، صدا یا گفتگو دارد. رهگیری ترافیک تا این بررسی‌ها روی مسیر اجرا شوند مشخص شده بود و هنوز در جریان بود. یک توسعه‌دهنده بک‌اند و یک توسعه‌دهنده فرانت‌اند را رهبری کردم: نیازها، وظیفه‌ها، جلسه‌ها و پشتیبانی فنی.",
        ],
      },
    ]),
  },
  {
    slug: "baas-platform",
    title: text("BAAS Platform", "پلتفرم BAAS"),
    excerpt: text(
      "Backend services for database management and APIs, with authentication, role-based access, and a microservice layout.",
      "سرویس‌های بک‌اند برای مدیریت پایگاه داده و API، با احراز هویت، دسترسی مبتنی بر نقش و چیدمان میکروسرویس.",
    ),
    technologies: tech(["React", "Laravel", "MySQL", "Docker"]),
    content: article([
      { h: ["Services", "سرویس‌ها"] },
      {
        p: [
          "The platform exposes database management and API handling as backend services. Authentication, role-based access, and a microservice layout let each part scale on its own. The client is React, the services are Laravel, and the data store is MySQL, packaged with Docker.",
          "پلتفرم مدیریت پایگاه داده و کار با API را به‌صورت سرویس بک‌اند ارائه می‌کند. احراز هویت، دسترسی مبتنی بر نقش و چیدمان میکروسرویس اجازه می‌دهد هر بخش جدا مقیاس بگیرد. کلاینت React است، سرویس‌ها Laravel هستند و داده در MySQL است و با Docker بسته‌بندی شده است.",
        ],
      },
    ]),
  },
  {
    slug: "dynamic-frontend",
    title: text("Dynamic Frontend", "فرانت‌اند پویا"),
    excerpt: text(
      "React applications that render forms, tables, and menus from backend configuration, so a new screen does not require a frontend change.",
      "اپلیکیشن‌های React که فرم، جدول و منو را از پیکربندی بک‌اند می‌سازند تا صفحه تازه به تغییر فرانت‌اند نیاز نداشته باشد.",
    ),
    technologies: tech(["React", "TypeScript"]),
    content: article([
      { h: ["Backend-driven UI", "رابط رانده‌شده از بک‌اند"] },
      {
        p: [
          "Page structure and navigation come from the backend. Forms, tables, and menus are data, and the React app renders them. A new screen can be introduced without a dedicated frontend change for that page. The same idea shows up in the data table, form generator, report generator, chart generator, widget system, and permission system used across the later products.",
          "ساختار صفحه و ناوبری از بک‌اند می‌آید. فرم، جدول و منو داده‌اند و اپلیکیشن React آن‌ها را رندر می‌کند. یک صفحه تازه را می‌توان بدون تغییر اختصاصی فرانت‌اند برای همان صفحه اضافه کرد. همین ایده در جدول داده، مولد فرم، مولد گزارش، مولد نمودار، سامانه ویجت و سامانه دسترسی محصول‌های بعدی هم دیده می‌شود.",
        ],
      },
    ]),
  },
];

const skillGroups: Array<{ name: LocalizedText; skills: string[] }> = [
  {
    name: text("Languages", "زبان‌ها"),
    skills: ["TypeScript", "JavaScript", "Python", "PHP", "Go"],
  },
  {
    name: text("Frameworks", "فریم‌ورک‌ها"),
    skills: ["Next.js", "React", "NestJS", "Laravel", "FastAPI"],
  },
  {
    name: text("Libraries", "کتابخانه‌ها"),
    skills: [
      "tRPC",
      "Pydantic",
      "LangChain",
      "LangGraph",
      "Turborepo",
      "React Table",
      "React Query",
      "DND-kit",
    ],
  },
  {
    name: text("Databases", "پایگاه‌های داده"),
    skills: ["PostgreSQL", "MySQL", "MSSQL", "MongoDB", "Redis", "Prisma"],
  },
  {
    name: text("Tools", "ابزارها"),
    skills: ["Docker", "RabbitMQ", "MQTT"],
  },
  {
    name: text("OS", "سیستم‌عامل"),
    skills: ["Linux (Ubuntu)", "Windows"],
  },
];

async function main() {
  await prisma.projectTechnology.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillGroup.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.language.deleteMany();
  await prisma.basicInfo.deleteMany();

  await prisma.basicInfo.createMany({
    data: basicInfo.map((item, sortOrder) => ({
      key: item.key,
      value: item.value as Prisma.InputJsonValue,
      sortOrder,
    })),
  });

  await prisma.experience.createMany({
    data: experiences.map((item, sortOrder) => ({
      company: item.company as Prisma.InputJsonValue,
      role: item.role as Prisma.InputJsonValue,
      period: item.period as Prisma.InputJsonValue,
      description: item.description as Prisma.InputJsonValue,
      sortOrder,
    })),
  });

  await prisma.education.createMany({
    data: [
      {
        degree: text(
          "B.Sc. Computer Engineering (Software)",
          "کارشناسی مهندسی کامپیوتر (نرم‌افزار)",
        ) as Prisma.InputJsonValue,
        institution: text(
          "Amirkabir University of Technology",
          "دانشگاه صنعتی امیرکبیر",
        ) as Prisma.InputJsonValue,
        sortOrder: 0,
      },
      {
        degree: text("Math-Physics Diploma", "دیپلم ریاضی‌فیزیک") as Prisma.InputJsonValue,
        institution: text("Allame Helli 1 (Sampad)", "علامه حلی ۱ (سمپاد)") as Prisma.InputJsonValue,
        sortOrder: 1,
      },
    ],
  });

  await prisma.language.createMany({
    data: [
      {
        name: text("Persian", "فارسی") as Prisma.InputJsonValue,
        level: text("Native", "زبان مادری") as Prisma.InputJsonValue,
        sortOrder: 0,
      },
      {
        name: text("English", "انگلیسی") as Prisma.InputJsonValue,
        level: text("Fluent", "مسلط") as Prisma.InputJsonValue,
        sortOrder: 1,
      },
    ],
  });

  for (const [sortOrder, project] of projects.entries()) {
    await prisma.project.create({
      data: {
        slug: project.slug,
        title: project.title as Prisma.InputJsonValue,
        excerpt: project.excerpt as Prisma.InputJsonValue,
        content: project.content as Prisma.InputJsonValue,
        sortOrder,
        technologies: {
          create: project.technologies.map((item) => ({
            name: item.name as Prisma.InputJsonValue,
            sortOrder: item.sortOrder,
          })),
        },
      },
    });
  }

  for (const [sortOrder, group] of skillGroups.entries()) {
    await prisma.skillGroup.create({
      data: {
        name: group.name as Prisma.InputJsonValue,
        sortOrder,
        skills: {
          create: group.skills.map((name, index) => ({
            name: same(name) as Prisma.InputJsonValue,
            sortOrder: index,
          })),
        },
      },
    });
  }
}

main().finally(() => prisma.$disconnect());
