import { notFound } from "next/navigation";
import SharedListClient from "./components/SharedListClient";
import type { List, ListItem, Category } from "@/app/type";
interface SharedListPageProps {
  params: Promise<{ token: string }>;
}

async function fetchSharedList(token: string) {
  const baseUrl = process.env.NEXTAUTH_URL;
  const res = await fetch(`${baseUrl}/api/shared/${token}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json() as Promise<{
    list: List;
    items: ListItem[];
    categories: Category[];
  }>;
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
