import { notFound } from "next/navigation";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { DemoRenderer } from "@/components/docs/demo-renderer";
import { COMPONENT_BY_SLUG } from "@/lib/components-catalog";

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const component = COMPONENT_BY_SLUG.get(slug);

  if (!component) {
    notFound();
  }

  return (
    <ComponentShowcase
      componentName={component.componentName}
      title={component.name}
      description={component.description}
    >
      <DemoRenderer slug={component.slug} />
    </ComponentShowcase>
  );
}
