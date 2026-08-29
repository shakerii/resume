"use client";

import {Document, Page, StyleSheet, Text, View, pdf} from "@react-pdf/renderer";
import {useState} from "react";

const styles = StyleSheet.create({
  page: {padding: 36, fontSize: 10, color: "#202124"},
  title: {fontSize: 22, marginBottom: 4},
  subtitle: {fontSize: 12, marginBottom: 10, color: "#3949ab"},
  section: {marginTop: 12},
  heading: {fontSize: 13, marginBottom: 5, color: "#3949ab"},
  item: {marginBottom: 6},
});

const ResumeDocument = () => (
  <Document title="Resume - Ramtin Shakeri">
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Ramtin Shakeri</Text>
      <Text style={styles.subtitle}>Software Engineer</Text>
      <Text>r.shakeri1375@gmail.com · +98 919 084 8501 · Tehran, Iran</Text>
      <Text style={styles.section}>Full-stack Software Engineer with 7+ years of experience building AI-driven applications, scalable platforms, and user-focused web solutions.</Text>
      <View style={styles.section}><Text style={styles.heading}>Work Experience</Text>
        <Text style={styles.item}>Farbonyan — Frontend & AI Developer (Feb 2024 – Present)</Text>
        <Text style={styles.item}>Interactive 10 — CTO & Software Engineer (Jun 2022 – Feb 2024)</Text>
        <Text style={styles.item}>Matap — CTO & Full-Stack Developer (Mar 2022 – Jun 2022)</Text>
        <Text style={styles.item}>Freelance — Full-Stack Developer (2020 – 2022)</Text>
      </View>
      <View style={styles.section}><Text style={styles.heading}>Projects</Text>
        <Text style={styles.item}>SABI — AI-powered reporting assistant (LangChain, NextJS, Redis)</Text>
        <Text style={styles.item}>FIS — B2B e-commerce platform for car parts (React, REST APIs)</Text>
        <Text style={styles.item}>Smart Catalog — Interactive product catalog builder (NextJS, DND-kit)</Text>
        <Text style={styles.item}>BAAS Platform — Backend and API management services (Laravel, MySQL)</Text>
      </View>
      <View style={styles.section}><Text style={styles.heading}>Education</Text><Text>B.Sc. Computer Engineering (Software), Amirkabir University of Technology</Text></View>
      <View style={styles.section}><Text style={styles.heading}>Skills</Text><Text>TypeScript, JavaScript, Python, PHP, Go, NextJS, React, FastAPI, Laravel, PostgreSQL, MySQL, MongoDB, Redis, Docker</Text></View>
    </Page>
  </Document>
);

export function ExportPdfButton() {
  const [busy, setBusy] = useState(false);
  async function handleExport() {
    setBusy(true);
    try {
      const blob = await pdf(<ResumeDocument />).toBlob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "Resume - Ramtin Shakeri.pdf";
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }
  return <button type="button" onClick={handleExport} disabled={busy}>{busy ? "Preparing PDF…" : "Export PDF"}</button>;
}
