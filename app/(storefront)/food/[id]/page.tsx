import { notFound } from "next/navigation";
import FoodDetail from "@/components/storefront/FoodDetail";
import { ApiError } from "@/lib/api/client";
import { getFood } from "@/lib/api/menu";

export default async function FoodPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const foodId = Number(id);
  if (!Number.isInteger(foodId)) notFound();

  const food = await getFood(foodId).catch((err) => {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  });

  return <FoodDetail food={food} />;
}
