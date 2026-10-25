# Resume

## Contact

- **Name:** Ramtin Shakeri
- **Title:** Software Engineer
- **Website:** ramtinshakeri.com
- **Email:** [r.shakeri1375@gmail.com](mailto:r.shakeri1375@gmail.com)
- **Phone:** +98 919 084 8501
- **GitHub:** [github.com/shakerii](https://github.com/shakerii)
- **Location:** Tehran, Iran

---

## Summary (from resume)

Full-stack Software Engineer with 7+ years of experience building AI-driven applications, scalable platforms, and user-focused web solutions. Experienced in leading teams, designing architecture, and delivering production-grade systems with modern stacks.

---

## Profile and Goals

Software engineer with extensive experience in the technology industry. Lives in Iran and intends to apply for positions in another country and relocate with their fiancé.

First steps:

1. Update LinkedIn
2. Update GitHub (all experience and projects are closed source)
3. Create a resume website to explain experiences and projects

The goal is to explain every project and the resume in a short format.

### Technical profile

- **Primary stack today:** TypeScript, React/Next.js, Node/NestJS, Python, Prisma (MSSQL, Postgres)
- **Self-description:** Full-stack and AI engineer
- **Target roles:** Senior Full-stack Engineer and AI Engineer
- **Countries:** The United States is the preferred destination, but it is not possible at present. Other target countries include the Netherlands, Spain, Poland, the United Kingdom, and others.
- **Relocation:** Intends to leave Iran, either through remote roles that could later support relocation, or through companies willing to sponsor relocation and a visa.

---

## Skills and Tech Stack

### Languages

TypeScript, JavaScript, Python, PHP, Go

### Frameworks and libraries

NextJS, ReactJS, tRPC, Prisma, FastAPI, Pydantic, LangChain, LangGraph, Laravel, NestJS, Turborepo, React Table, React Query, DND-kit

### Databases

MySQL, PostgreSQL, MongoDB, Prisma, Redis, MSSQL

### Tools

Docker, RabbitMQ, MQTT

### OS

Linux (Ubuntu), Windows

---

## Reusable Systems / Samples

- **Data Table:** global search, column-specific search, grouping, ordering, column reordering, column visibility, pinning columns, pagination, dynamic row actions (left-click menu), dynamic batch actions (shown when multiple rows are selected), dynamic global actions, dynamic Excel and PDF export
- Tab-based website
- Widget system
- Permission system
- Form generator
- Report generator
- Chart generator
- Pivot table

---

## Education

- **B.Sc. Computer Engineering (Software)**, Amirkabir University of Technology
- **Math-Physics Diploma**, Allame Helli 1 (Sampad)

## Languages

Persian (Native), English (Fluent)

---

## Work Experience

### Farbonyan - Full-stack & AI Developer / Software Engineer & AI Developer

**Feb 2024 – Present**

Developing AI-powered data analysis and reporting tools with LangChain and Next.js. Built dashboards and visualizations that let non-technical users obtain insights from company data.

The role is divided into 40% frontend, 30% backend, and 30% AI/data.

#### FIS (Farbonyan Intelligent Solution / Farbonyan Intelligent Sales) - frontend

React-based B2B e-commerce platform for car parts sales, inventory, and shipment management. Improved user workflows and automated order handling. The platform supports hundreds of SKUs and multiple vendors.

It is also described as a Next.js frontend application for B2B sales, with a tab-based website, a customizable dashboard, and menus and options controlled by access rights.

**Tech:** ReactJS, React Table, React Query, REST APIs, Docker

**Frontend**

The frontend uses Next.js, and React version 19, with TypeScript and TanStack Query. Zustand and Redux are not used; application state is handled with React context. No UI framework is used. The interface is built with shadcn, customized for handling right-to-left (RTL) layout, with a number of additional components.

The interface is organized as tabs. A list of tabs (pages) uses Zod for tab props, together with a tab manager provider. When the user clicks a menu item, or takes an action that requires a tab, `useTabOpener` opens another tab with props.

The project includes a complex data table built with TanStack React Table, with filters, sorting, multi-level grouping, column ordering, and other table behavior.

**Data table details**

The table supports global filtering, column filtering, pagination, column ordering, column sizing, column pinning, column visibility, row actions, batch actions, global actions, row selection, and export to Excel and PDF. It also supports tree-like data, along with multi-level grouping and aggregations (count, sum, mean, max, min). A single page can hold more than 100,000 rows of data through virtualization. Everything runs on the client, for the convenience of the backend developer. Columns are passed into the table separately for each table, so the table is dynamic. Inline editing is used in a few cases.

**Scale**

The platform has 200 vendors, of which 20 are active. The number of orders is not known.

**Python neural-network car part attribute extractor**

The input is the name of the part, in Persian. The attributes to extract are defined dynamically in the admin panel. The model architecture is Torch, developed with the assistance of AI, and the service is implemented with Flask and Torch. The model was trained personally. The dataset is the set of pre-defined parts in the platform. Token search, implemented with handwritten logic, was also used to seed the first attributes. The dataset contains 2,000 parts. The output is an array of predicted attributes. Accuracy is low, roughly estimated at around 70%. The extractor is integrated as a separate service. A personal note in the source states that this work is not considered a strong portfolio case study.

#### HMS (Holding Management System) - full-stack

Holding management admin dashboard with a data warehouse and with data gathered from subsidiary companies.

The system includes dynamic pivot-table reporting and a Mustache code generator that produces code for each base model more quickly.

**Data warehouse**

Almost all subsidiary companies’ applications use MSSQL. One is SAP, and that work has not been started yet. Data is collected at night by a SQL job. That part of the database was written by the CTO. One client’s data is around 1 TB, and the data is synchronized every night.

**Pivot reporting**

Users can dynamically select dimensions and measures and generate arbitrary reports without engineering intervention.

Dimensions cover filters, rows, values, and groups. Supported aggregations are sum, average, count, minimum, and maximum. Filtering is supported: a user can set a default filter, or move the filter to a form when fetching the report. Grouping is supported. Calculated fields are not supported. Export uses the DataTable described above. Charts are supported: a user can choose the x-axis from the rows and the y-axis from the values, and can aggregate results by grouping them according to other rows.

**Report builder (related)**

This is a Next.js and tRPC project with a form for a dynamic query builder. A filter form passes data to a query generator. The generator handles joins, column selection, aggregation, and multistep queries. It creates the table with the initial view properties, including grouping and ordering, and it creates a list of charts so the user can choose which of those data to display.

**Code generator**

The generator produces a model, such as a user or a product, together with the list view, the create and update form, and the delete API. On the tRPC side, it generates all of the APIs. This saved around three months of development, because there were many base models.

#### SABI (Smart Assistant for Business Intelligence)

AI-powered reporting assistant that generates business insights from company data. The work included conversational workflows, automated chart and report generation, and integrated database querying.

It is also described as a Next.js, tRPC, FastAPI, LangChain, and LangGraph project focused on a personal assistant for businesses. The assistant includes a chatbot that connects to company databases and uses low-budget, low-quality AI models to answer employees’ questions. It supports text, audio, tables, and charts. When a user asks a question about sales, for example, the assistant draws a chart and then explains it. It maintains a knowledge graph of company documents and attempts to answer every question by referring to those documents. Each company can provide the assistant with its own instructions for how to calculate anything. The assistant supports multiple languages, and users can upload files to add them to the knowledge graph. Users can ask questions, receive charts and tables, save those as personal reports, and add those reports to their dashboard. Each user has row-level access control. The strength of the system is its generic implementation.

The system does not trust the AI to decide anything for the business. Each technical definition is given to the model, and the model refers to those definitions many times per question.

**Tech:** LangChain, LangGraph, NextJS, tRPC, Redis, Docker (FastAPI is also listed in the work-experiences description)

Features:

1. Chat-based report builder
2. Report generator
3. Permission control
4. Calendar management
5. Knowledge graph

**LLM**

The model is Llama 4 Maverick, chosen because a small, downloadable model was required. LangChain and LangGraph are used for decision making, including whether the user has permission and whether the question is relevant. Agents were not implemented. An agent-based design was intended, but there was not enough time to build it. Tools are used, specifically database query, notification, and report creation. Every step returns structured output. Retrieval-augmented generation is used for entity search and knowledge-graph search.

**Database querying**

The flow is: user question, then the LLM, then scope, then the tables related to that scope, then schema understanding, then SQL generation, then validation, then execution, then the result, then visualization.

A database rules table stores the guidance for querying each table. The user chooses which database to query.

Unsafe queries were not fully handled at the time. They were handled only through those database rules and by replacing where clauses with user-accessed row IDs. A query builder now exists, the pivot table described above, and the plan is to switch to it. If the model handles querying by giving the structure of a pivot table, that problem would not occur.

**Report generation**

The assistant generates tables that include all of the DataTable features, charts, and written analysis.

**Conversational report builder**

Example conversation:

- “Show me sales by region”
- “Only last quarter”
- “Compare it with the previous quarter”
- “Save this report”
- “Give me sale comparison of these products”
- “What company did better last year”

The system keeps conversational state and modifies the existing report as the conversation continues.

**Knowledge graph**

The user provides a document, such as a PDF, Word or a text file. A prompt runs on each paragraph and extracts nodes and relations.

NodeType:

- concept
- definition
- formula
- entity
- purpose

NodePurpose:

- context
- query
- visualization
- analysis

RelationType:

- includes
- excludes
- dependent
- same_as
- related_to
- mapped_to

The graph is saved locally, because of living in Iran. It is called in one of the first steps of LangGraph. The plan is to implement an agentic flow and to pass the graph as a tool.

In the test stage, the graph solved the problem of understanding basic accounting logic, because the model did not have enough knowledge to understand almost any of that subject.

**Permission control**

The system reads the database first and extracts all tables and columns. The user then selects some tables as permissions, and those tables appear as a permission selector on the user form. After that, every query checks those tables and rows.

---

### Interactive 10 (Remote) - Team Lead & Software Engineer / CTO & Software Engineer

**Jun 2022 – Feb 2024**

Led a development team delivering a real estate data-gathering platform. The same work is also described as leading a distributed development team that delivered SaaS platforms for interactive media clients.

Implemented a website with Next.js, tRPC, and Prisma, a React Native application, and a website scraper that collected data for users from other real estate websites.

The work also included CI/CD pipelines and scalable backend services, which reduced the release cycle by 70%.

**Architecture**

The architecture is Next.js, then tRPC, then Node, then Prisma, then PlanetScale. The database is PlanetScale (MySQL). The application is hosted on Vercel, and it is containerized with Docker. CI/CD runs through Vercel. Authentication uses next-auth. Data fetching runs as a background job on Vercel. Queues are used, but they are stored in the database rather than implemented as a message queue.

**Scraping platform**

The scraped sites are Rightmove, Zoopla, PropertyFinder, Bayut, Dubizzle, and DxbInteract.

How collection works:

- **App:** A webview in the application, used as a website opener, injects a JavaScript file that adds a save button to every property. That button sends the HTML to the backend. The JavaScript is a React build produced with Vite.
- **Web:** A Plasmo extension detects the websites and adds the save button.
- **Extraction:** A Python worker reads the HTML and extracts the data with AutoScraper. AutoScraper was trained on a set of sample HTML pages from those websites.

Data is read when the user issues a save command. The system does not scrape all properties. Those websites did not change their structure much. Collection is command-based.

**Leadership**

Led two frontend developers (one mid-level and one junior), one designer, and one marketing person, and served as the full-stack developer. In practice, the lead role meant analyzing requirements, creating tasks, managing those tasks, managing meetings, and similar responsibilities.

---

### Matap - Team Lead & Backend Developer / CTO & Full-Stack Developer

**Mar 2022 – Jun 2022**

Designed the architecture for a doctor reservation and medicine prescription system. Led a team of one designer and two frontend developers, and implemented the backend with NestJS.

The same period is also described as designing architecture for B2B web platforms and implementing core backend services.

---

### Freelance - Full-Stack Developer

**2020 – 2022**

Delivered custom web applications for clients with React, Node.js, and PHP/Laravel.

Worked on two to three startups and ideas. None of them worked out:

- A stock-prediction neural network
- A coffee-bean distribution platform
- A learning website

---

### Raymon Co. - WordPress & ReactJS Developer

**2019 – 2020**

Hired to create a backend B2B panel for FMCG products. The MVP was a WordPress WooCommerce site, and work began on a custom plugin.

When the company wanted to hire a React developer, asked to learn React and start on that project. One month was given for this. After that, the company hired another backend developer, and the work moved to the frontend.

Created an admin panel and a simple panel for customers.

---

### Tinext Co. - Laravel Developer

**2018**

Created an online order-tracking application with HTML, CSS, JavaScript, and PHP. After that, learned to develop with Laravel.

---

### Amirkabir IoT Lab - Research & Development

**2016 – 2017**

While at Amirkabir University, worked on the IoT team. Worked on a service-based Python application with Flask that could handle logging events in a smart home. Also worked on designing a system that could handle many smart devices in houses.

---

## Other Projects

### Smart Catalog Builder - full-stack (freelance)

Admin dashboard that lets companies design interactive product catalogs with dynamic filters and exports. Usability was improved with drag-and-drop components and a real-time preview.

Users can create an online catalog for a business and share a link that displays the catalog in an iframe on that business’s website. Every component can be dragged onto the page. Components support enter and exit animations, and they support actions that trigger other components, link to another page of the catalog, or link to another website. Each catalog has an image and video gallery.

**Tech:** NextJS, tRPC, DND-kit, TailwindCSS, MySQL, Docker

**How the designer works**

The user uploads images, then drags and drops them onto each page of each catalog as components. After that, the user edits each component’s attributes, including shadow and enter and exit animation.

Drag-and-drop changes the image ID, the x position as a percentage, and the y position as a percentage.

In SQL, one catalog has many pages, and each page has many components. The layout is not stored as a JSON or schema representation.

There is no separate render step. All images are added when the page loads, and related pages are preloaded.

The catalog can be exported as a PDF.

The preview is real time: attributes are updated whenever the user changes them.

tRPC was chosen for type safety. The database listed as MySQL was in fact Postgres, and that database was the first choice. The project is deployed with Docker. It did not reach production. The company failed before the project launched.

---

### Ping Enhancement - team lead (freelance)

Game ping enhancement application with a router service, written in Golang with MongoDB, that checks policies for games before a connection is established. The policies cover game, voice, and chat.

The team was one backend developer and one frontend developer.

**Details**

The router application re-routes the user’s packets for the game. Golang is used in the routers. MongoDB is used in the FastAPI backend to store logs. The router intercepts traffic. That behavior is not implemented yet, but it should check the policies. The router modifies routes. Choosing the optimal route is the administrator’s responsibility. The policies cover whether the game is active, whether the user is active, and whether the user has access to that game, including voice access, chat access, and gameplay access. Games are added on an ongoing basis. Data is transferred with the WireGuard protocol, using sing-box on the client. Voice and chat traffic is handled in the same way as other packets, and that area is still under research.

As team lead, the responsibilities were analyzing requirements, creating tasks, managing those tasks, managing meetings, helping developers with technical problems, and similar work.

---

### Dynamic frontend

React projects that handle dynamic forms, tables, and menus in the frontend without needing a frontend developer. All page structure and menus come from the backend.

---

### BAAS Platform

Designed backend services for database management and API handling, including authentication, role-based access, and a scalable microservice architecture.

**Tech:** ReactJS, Laravel, MySQL, Docker
