"use client";

import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ResumeData } from "~/components/resume/types";
import { plainText } from "~/utils/html";

Font.register({
  family: "Vazirmatn",
  src: "/fonts/Vazirmatn-Regular.ttf",
});
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    fontFamily: "Vazirmatn",
    color: "#202124",
  },
  title: { fontSize: 22, marginBottom: 4 },
  subtitle: { fontSize: 12, marginBottom: 8 },
  section: { marginTop: 12 },
  heading: { fontSize: 13, marginBottom: 4 },
  item: { marginBottom: 4 },
});

function linkLabel(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function ResumeDocument({
  data,
  labels,
}: {
  data: ResumeData;
  labels: {
    experience: string;
    projects: string;
    skills: string;
    education: string;
    languages: string;
    tech: string;
  };
}) {
  return (
    <Document title={data.name}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{data.name}</Text>
        <Text style={styles.subtitle}>{data.title}</Text>
        <Text>
          {[linkLabel(data.website), data.email, data.phone, data.location].filter(Boolean).join(" · ")}
        </Text>
        <Text style={styles.section}>{data.summary}</Text>
        <View style={styles.section}>
          <Text style={styles.heading}>{labels.experience}</Text>
          {data.experiences.map((item) => (
            <Text key={item.id} style={styles.item}>
              {item.company} - {item.role}
              {item.period ? ` (${item.period})` : ""}
              {plainText(item.description) ? ` ${plainText(item.description)}` : ""}
            </Text>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>{labels.projects}</Text>
          {data.projects.map((project) => (
            <Text key={project.id} style={styles.item}>
              {project.title}
              {plainText(project.excerpt) ? ` - ${plainText(project.excerpt)}` : ""}
              {project.technologies.length ? ` (${labels.tech}: ${project.technologies.join(", ")})` : ""}
            </Text>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>{labels.education}</Text>
          {data.education.map((item) => (
            <Text key={item.id}>
              {item.degree}
              {item.institution ? `, ${item.institution}` : ""}
              {plainText(item.description) ? ` ${plainText(item.description)}` : ""}
            </Text>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>{labels.skills}</Text>
          {data.skillGroups.map((group) => (
            <Text key={group.id}>
              {group.name}: {group.skills.map((skill) => `${skill.name} (${skill.rating}/10)`).join(", ")}
            </Text>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>{labels.languages}</Text>
          <Text>
            {data.languages.map((item) => (item.level ? `${item.name} (${item.level})` : item.name)).join(", ")}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
