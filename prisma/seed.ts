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
    role: text("Software Engineer & AI Developer", "مهندس نرم‌افزار و توسعه‌دهنده هوش مصنوعی"),
    period: text("Feb 2024 – Present", "فوریه ۲۰۲۴ – اکنون"),
    description: bullets([
      [
        "Built dashboards and visualizations enabling non-technical users to gain insights from company data.",
        "داشبورد و مصورسازی ساختم تا کاربران غیرفنی از داده‌های شرکت بینش بگیرند.",
      ],
      [
        "Developing AI-powered data analysis and reporting tools using LangChain and Next.js.",
        "ابزارهای تحلیل داده و گزارش‌گیری مبتنی بر هوش مصنوعی را با LangChain و Next.js توسعه می‌دهم.",
      ],
    ]),
  },
  {
    company: text("Interactive 10 (Remote)", "اینتراکتیو ۱۰ (دورکاری)"),
    role: text("CTO & Software Engineer", "مدیر فناوری و مهندس نرم‌افزار"),
    period: text("Jun 2022 – Feb 2024", "ژوئن ۲۰۲۲ – فوریه ۲۰۲۴"),
    description: bullets([
      [
        "Led a distributed development team delivering SaaS platforms for interactive media clients.",
        "یک تیم توسعه توزیع‌شده را رهبری کردم و پلتفرم‌های SaaS را برای مشتریان رسانه تعاملی تحویل دادم.",
      ],
      [
        "Implemented CI/CD pipelines and scalable backend services, reducing the release cycle by 70%.",
        "خط لوله CI/CD و سرویس‌های بک‌اند مقیاس‌پذیر را پیاده کردم و چرخه انتشار را ۷۰٪ کاهش دادم.",
      ],
    ]),
  },
  {
    company: text("Matap", "متاپ"),
    role: text("CTO & Full-Stack Developer", "مدیر فناوری و توسعه‌دهنده فول‌استک"),
    period: text("Mar 2022 – Jun 2022", "مارس ۲۰۲۲ – ژوئن ۲۰۲۲"),
    description: bullets([
      [
        "Designed architecture for B2B web platforms and implemented core backend services.",
        "معماری پلتفرم‌های وب B2B را طراحی کردم و سرویس‌های اصلی بک‌اند را پیاده کردم.",
      ],
    ]),
  },
  {
    company: text("Freelance", "فریلنس"),
    role: text("Full-Stack Developer", "توسعه‌دهنده فول‌استک"),
    period: text("2020 – 2022", "۲۰۲۰ – ۲۰۲۲"),
    description: bullets([
      [
        "Delivered custom web applications for clients using React, Node.js, and PHP/Laravel.",
        "اپلیکیشن‌های وب سفارشی را برای مشتریان با React و Node.js و PHP/Laravel تحویل دادم.",
      ],
    ]),
  },
  {
    company: text("Raymon Co.", "شرکت رایمون"),
    role: text("WordPress & ReactJS Developer", "توسعه‌دهنده وردپرس و React"),
    period: text("2019 – 2020", "۲۰۱۹ – ۲۰۲۰"),
    description: bullets([
      [
        "Built an admin panel and a customer panel for an FMCG B2B product, starting from a WooCommerce MVP and moving the interface to React.",
        "پنل مدیریت و پنل مشتریان را برای یک محصول B2B در حوزه کالاهای تندمصرف ساختم؛ کار از MVP ووکامرس شروع شد و رابط به React منتقل شد.",
      ],
    ]),
  },
  {
    company: text("Tinext Co.", "شرکت تی‌نکست"),
    role: text("Laravel Developer", "توسعه‌دهنده Laravel"),
    period: text("2018", "۲۰۱۸"),
    description: bullets([
      [
        "Created an online order-tracking application with HTML, CSS, JavaScript, and PHP, then continued development with Laravel.",
        "یک سامانه پیگیری سفارش آنلاین با HTML و CSS و JavaScript و PHP ساختم و بعد توسعه را با Laravel ادامه دادم.",
      ],
    ]),
  },
  {
    company: text("Amirkabir IoT Lab", "آزمایشگاه اینترنت اشیاء امیرکبیر"),
    role: text("Research & Development", "تحقیق و توسعه"),
    period: text("2016 – 2017", "۲۰۱۶ – ۲۰۱۷"),
    description: bullets([
      [
        "Worked on a service-based Python application with Flask for smart-home event logging, and on a design that could handle many in-home devices.",
        "روی یک اپلیکیشن پایتون مبتنی بر سرویس با Flask برای ثبت رویدادهای خانه هوشمند کار کردم و سیستمی برای مدیریت تعداد زیاد دستگاه در خانه طراحی کردم.",
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
    title: text("SABI", "SABI"),
    excerpt: text(
      "Developed an AI-powered reporting assistant that generates business insights from company data. Built conversational workflows, automated chart and report generation, and integrated database querying.",
      "دستیار گزارش‌گیری مبتنی بر هوش مصنوعی ساختم که از داده‌های شرکت بینش کسب‌وکار تولید می‌کند. گردش کار گفتگومحور، ساخت خودکار نمودار و گزارش، و پرس‌وجوی یکپارچه پایگاه داده را پیاده کردم.",
    ),
    technologies: tech(["LangChain", "LangGraph", "Next.js", "tRPC", "Redis", "Docker"]),
    content: article([
      { h: ["Overview", "معرفی"] },
      {
        p: [
          "SABI is a personal assistant for businesses. A chatbot connects to company databases and answers employee questions with text, tables, and charts. Each company can supply its own instructions for how calculations should work.",
          "SABI یک دستیار برای کسب‌وکارهاست. چت‌بات به پایگاه داده شرکت وصل می‌شود و به سؤال کارکنان با متن، جدول و نمودار جواب می‌دهد. هر شرکت می‌تواند دستور خودش را برای نحوه محاسبه بدهد.",
        ],
      },
      { h: ["What it includes", "امکانات"] },
      {
        items: [
          [
            "Chat-based report builder that keeps conversational state and updates the current report.",
            "گزارش‌ساز گفتگومحور که وضعیت مکالمه را نگه می‌دارد و گزارش جاری را به‌روز می‌کند.",
          ],
          [
            "Query flow from the question through scope, schema, SQL generation, validation, execution, and visualization.",
            "مسیر پرس‌وجو از سؤال تا محدوده، شما، تولید SQL، اعتبارسنجی، اجرا و مصورسازی.",
          ],
          [
            "Knowledge graph built from uploaded documents, plus row-level access control for each user.",
            "گراف دانش از سندهای بارگذاری‌شده، به‌همراه کنترل دسترسی در سطح ردیف برای هر کاربر.",
          ],
        ],
      },
      {
        p: [
          "The system does not let the model invent business rules. Technical definitions are provided, and the model refers back to them while answering. LangChain and LangGraph handle the decision steps, and every step returns structured output.",
          "سیستم اجازه نمی‌دهد مدل قواعد کسب‌وکار را از خودش بسازد. تعریف‌های فنی به مدل داده می‌شود و مدل هنگام پاسخ به همان تعریف‌ها برمی‌گردد. LangChain و LangGraph گام‌های تصمیم را جلو می‌برند و هر گام خروجی ساخت‌یافته برمی‌گرداند.",
        ],
      },
    ]),
  },
  {
    slug: "fis",
    title: text("FIS (Farbonyan Intelligent Sales)", "FIS (فروش هوشمند فربنیان)"),
    excerpt: text(
      "Engineered a React-based B2B e-commerce platform for car parts sales, inventory, and shipment management. Improved user workflows and automated order handling, supporting hundreds of SKUs and multiple vendors.",
      "یک پلتفرم تجارت الکترونیک B2B با React برای فروش، موجودی و حمل قطعات خودرو ساختم. گردش کار کاربران را بهتر کردم و ثبت سفارش را خودکار کردم؛ سامانه صدها کالا و چند فروشنده را پوشش می‌دهد.",
    ),
    technologies: tech(["React", "React Table", "React Query", "REST APIs", "Docker"]),
    content: article([
      { h: ["Platform", "پلتفرم"] },
      {
        p: [
          "FIS is a Next.js frontend for B2B car-parts sales. The interface is organized as tabs. Menus and options follow access rights, and application state lives in React context. The UI is built with shadcn, customized for right-to-left layout.",
          "FIS فرانت‌اند Next.js برای فروش B2B قطعات خودروست. رابط به‌صورت تب سازماندهی شده است. منوها و گزینه‌ها با سطح دسترسی کنترل می‌شوند و وضعیت برنامه در React context نگه داشته می‌شود. رابط با shadcn و با پشتیبانی از راست‌به‌چپ ساخته شده است.",
        ],
      },
      { h: ["Data table", "جدول داده"] },
      {
        items: [
          [
            "Global and column filtering, sorting, pagination, column ordering, sizing, pinning, and visibility.",
            "فیلتر سراسری و ستونی، مرتب‌سازی، صفحه‌بندی، ترتیب و اندازه و سنجاق و نمایش ستون‌ها.",
          ],
          [
            "Row actions, batch actions, global actions, selection, and export to Excel and PDF.",
            "عملیات ردیف، عملیات دسته‌ای، عملیات سراسری، انتخاب ردیف و خروجی Excel و PDF.",
          ],
          [
            "Tree data, multi-level grouping, aggregations, and virtualization for very large client-side tables.",
            "داده درختی، گروه‌بندی چندسطحی، تجمیع و مجازی‌سازی برای جدول‌های خیلی بزرگ در سمت کلاینت.",
          ],
        ],
      },
      {
        p: [
          "A separate Flask and Torch service reads a Persian part name and predicts attributes defined in the admin panel. It was trained on the platform's own parts list and integrated as its own service.",
          "یک سرویس جدا با Flask و Torch نام فارسی قطعه را می‌خواند و ویژگی‌هایی را پیش‌بینی می‌کند که در پنل مدیریت تعریف شده‌اند. مدل روی فهرست قطعات خود پلتفرم آموزش دیده و به‌صورت سرویس جدا وصل شده است.",
        ],
      },
    ]),
  },
  {
    slug: "hms",
    title: text("HMS", "HMS"),
    excerpt: text(
      "Holding management dashboard with a data warehouse gathered from subsidiary companies, dynamic pivot reporting, and a code generator for base models.",
      "داشبورد مدیریت هلدینگ با انبار داده جمع‌شده از شرکت‌های زیرمجموعه، گزارش محوری پویا و مولد کد برای مدل‌های پایه.",
    ),
    technologies: tech(["Next.js", "tRPC", "Prisma", "MSSQL"]),
    content: article([
      { h: ["Data warehouse", "انبار داده"] },
      {
        p: [
          "Most subsidiary applications use MSSQL. Data is collected at night by a SQL job and synchronized on a schedule. One client’s data is around 1 TB.",
          "بیشتر نرم‌افزارهای شرکت‌های زیرمجموعه MSSQL هستند. داده شب‌ها با یک SQL job جمع می‌شود و طبق برنامه همگام می‌شود. داده یکی از مشتری‌ها حدود ۱ ترابایت است.",
        ],
      },
      { h: ["Pivot reporting", "گزارش محوری"] },
      {
        items: [
          [
            "Users pick dimensions and measures and build reports without an engineer in the loop.",
            "کاربر بُعد و سنجه را انتخاب می‌کند و بدون دخالت مهندس گزارش می‌سازد.",
          ],
          [
            "Supported aggregations are sum, average, count, minimum, and maximum, with filters and grouping.",
            "تجمیع‌های پشتیبانی‌شده جمع، میانگین، تعداد، کمینه و بیشینه هستند، همراه با فیلتر و گروه‌بندی.",
          ],
          [
            "Charts use pivot rows for the x-axis and values for the y-axis. A Mustache generator produces list views, forms, and tRPC APIs for base models.",
            "نمودارها ردیف‌های محوری را برای محور افقی و مقدارها را برای محور عمودی می‌گیرند. یک مولد Mustache نمای فهرست، فرم و APIهای tRPC را برای مدل‌های پایه می‌سازد.",
          ],
        ],
      },
    ]),
  },
  {
    slug: "smart-catalog",
    title: text("Smart Catalog", "کاتالوگ هوشمند"),
    excerpt: text(
      "Built an admin dashboard for companies to design interactive product catalogs with dynamic filters and exports. Enhanced usability with drag-and-drop components and real-time preview.",
      "داشبورد مدیریتی ساختم تا شرکت‌ها کاتالوگ محصول تعاملی را با فیلتر پویا و خروجی طراحی کنند. کشیدن و رها کردن اجزا و پیش‌نمایش زنده کار با آن را ساده‌تر کرد.",
    ),
    technologies: tech(["Next.js", "tRPC", "DND-kit", "Tailwind CSS", "PostgreSQL", "Docker"]),
    content: article([
      { h: ["Designer", "طراح"] },
      {
        p: [
          "A company builds an online catalog and shares a link that renders inside an iframe on its own site. Images are dragged onto each page. Components support enter and exit animations and actions that open another component, another catalog page, or an external site.",
          "شرکت یک کاتالوگ آنلاین می‌سازد و پیوندی به اشتراک می‌گذارد که در iframe سایت خودش نمایش داده می‌شود. تصویرها روی هر صفحه کشیده می‌شوند. اجزا انیمیشن ورود و خروج دارند و می‌توانند جزء دیگر، صفحه دیگر کاتالوگ یا یک سایت بیرونی را باز کنند.",
        ],
      },
      {
        p: [
          "In the database, one catalog has many pages and each page has many components. Positions are stored as percentages. There is no separate render step: images load with the page, related pages are preloaded, and the preview updates as attributes change. The catalog can also be exported as a PDF.",
          "در پایگاه داده هر کاتالوگ چند صفحه دارد و هر صفحه چند جزء. موقعیت‌ها به‌صورت درصد ذخیره می‌شوند. مرحله رندر جدا وجود ندارد: تصویرها با صفحه بارگذاری می‌شوند، صفحه‌های مرتبط از قبل بارگذاری می‌شوند و پیش‌نمایش با تغییر ویژگی‌ها به‌روز می‌شود. کاتالوگ را می‌توان به PDF هم خروجی گرفت.",
        ],
      },
    ]),
  },
  {
    slug: "ping-enhancement",
    title: text("Ping Enhancement", "بهبود پینگ"),
    excerpt: text(
      "Game ping enhancement with a Golang router service and MongoDB. Policies for game, voice, and chat are checked before a connection is established.",
      "بهبود پینگ بازی با یک سرویس مسیریاب به زبان Go و MongoDB. سیاست‌های بازی، صدا و گفتگو پیش از برقراری اتصال بررسی می‌شوند.",
    ),
    technologies: tech(["Go", "MongoDB", "FastAPI", "WireGuard"]),
    content: article([
      { h: ["Router", "مسیریاب"] },
      {
        p: [
          "The router re-routes the player’s game packets. Golang runs on the routers. MongoDB, behind a FastAPI service, stores logs. Choosing the route is an administrator decision. Policies cover whether the game is active, whether the user is active, and whether that user may play, talk, or use voice.",
          "مسیریاب بسته‌های بازی بازیکن را دوباره مسیردهی می‌کند. Go روی مسیریاب‌ها اجرا می‌شود. MongoDB پشت یک سرویس FastAPI لاگ‌ها را نگه می‌دارد. انتخاب مسیر با مدیر است. سیاست‌ها مشخص می‌کنند بازی فعال است یا نه، کاربر فعال است یا نه، و آیا آن کاربر اجازه بازی، گفتگو یا صدا دارد.",
        ],
      },
      {
        p: [
          "Data is intended to move with the WireGuard protocol, using sing-box on the client. I led one backend developer and one frontend developer: requirements, tasks, meetings, and technical support.",
          "قرار است داده با پروتکل WireGuard و sing-box در کلاینت منتقل شود. یک توسعه‌دهنده بک‌اند و یک توسعه‌دهنده فرانت‌اند را رهبری کردم: نیازها، وظیفه‌ها، جلسه‌ها و پشتیبانی فنی.",
        ],
      },
    ]),
  },
  {
    slug: "baas-platform",
    title: text("BAAS Platform", "پلتفرم BAAS"),
    excerpt: text(
      "Designed backend services for database management and API handling, including authentication, role-based access, and a scalable microservice architecture.",
      "سرویس‌های بک‌اند را برای مدیریت پایگاه داده و API طراحی کردم، از جمله احراز هویت، دسترسی مبتنی بر نقش و معماری میکروسرویس مقیاس‌پذیر.",
    ),
    technologies: tech(["React", "Laravel", "MySQL", "Docker"]),
    content: article([
      { h: ["Services", "سرویس‌ها"] },
      {
        p: [
          "The platform exposes database management and API handling as backend services. Authentication, role-based access, and a microservice layout are part of the design so each service can scale on its own.",
          "این پلتفرم مدیریت پایگاه داده و کار با API را به‌صورت سرویس بک‌اند ارائه می‌کند. احراز هویت، دسترسی مبتنی بر نقش و چیدمان میکروسرویس بخشی از طراحی است تا هر سرویس جداگانه مقیاس بگیرد.",
        ],
      },
    ]),
  },
  {
    slug: "dynamic-frontend",
    title: text("Dynamic frontend", "فرانت‌اند پویا"),
    excerpt: text(
      "React projects that render dynamic forms, tables, and menus from the backend, so page structure does not require a frontend developer for every change.",
      "پروژه‌های React که فرم، جدول و منوی پویا را از بک‌اند می‌سازند تا برای هر تغییر ساختار صفحه به توسعه‌دهنده فرانت‌اند نیاز نباشد.",
    ),
    technologies: tech(["React", "TypeScript"]),
    content: article([
      { h: ["Backend-driven UI", "رابط رانده‌شده از بک‌اند"] },
      {
        p: [
          "Page structure and menus come from the backend. Forms, tables, and navigation are described as data, and the React app renders them. New screens can be introduced without a dedicated frontend change for every page.",
          "ساختار صفحه و منوها از بک‌اند می‌آید. فرم‌ها، جدول‌ها و ناوبری به‌صورت داده توصیف می‌شوند و اپلیکیشن React آن‌ها را رندر می‌کند. صفحه‌های تازه را می‌توان بدون تغییر اختصاصی فرانت‌اند برای هر صفحه اضافه کرد.",
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
    skills: ["Next.js", "React", "FastAPI", "Laravel", "NestJS"],
  },
  {
    name: text("Libraries", "کتابخانه‌ها"),
    skills: ["Turborepo", "React Table", "React Query", "DND-kit", "tRPC", "LangChain", "LangGraph"],
  },
  {
    name: text("Databases", "پایگاه‌های داده"),
    skills: ["MySQL", "PostgreSQL", "MongoDB", "Prisma", "Redis"],
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
