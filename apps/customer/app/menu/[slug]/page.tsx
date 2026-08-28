export const dynamic = "force-dynamic";

import MenuDetailClient from "./MenuDetailClient";

export default async function MenuDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <MenuDetailClient slug={slug} />;
}
