import { getExamConfig, isExamSlug } from "@/lib/exam-registry";
import { ResultClient } from "./result-client";

type Props = {
  searchParams: Promise<{ e?: string }>;
};

export async function generateMetadata({ searchParams }: Props) {
  const sp = await searchParams;
  const slug = sp.e;
  const title =
    slug && isExamSlug(slug) ? getExamConfig(slug)?.title : null;
  return {
    title: "결과",
    description: title ? `${title} 채점 및 해설` : "모의고사 채점 및 해설",
  };
}

export default async function ResultPage({ searchParams }: Props) {
  const sp = await searchParams;
  return <ResultClient examSlugParam={sp.e ?? null} />;
}
