import { notFound } from "next/navigation";
import SharedListClient from "./components/SharedListClient";
import type { List, ListItem, Category } from "@/app/type";
import { authenticatedFetch } from "@/lib/api-helper";

interface SharedListPageProps {
  params: Promise<{ token: string }>;
}

async function fetchSharedList(token: string) {
  const res = await authenticatedFetch<{
    list: List;
    items: ListItem[];
    categories: Category[];
  }>(`/api/shared/${token}`);

  return res;
}

export default async function SharedListPage({ params }: SharedListPageProps) {
  const { token } = await params;

  const data = await fetchSharedList(token);

  if (!data) {
    notFound();
  }

  return (
    <SharedListClient
      list={data.list}
      initialItems={data.items}
      categories={data.categories}
      token={token}
    />
  );
}
