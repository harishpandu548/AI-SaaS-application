import IdeaGeneratorClient from "./client";

export const metadata = {
  title: "AI Idea Generator",
  description:
    "Generate startup, content, feature, and monetization ideas using AI.",
};

export default function IdeasPage() {
  return <IdeaGeneratorClient />;
}
