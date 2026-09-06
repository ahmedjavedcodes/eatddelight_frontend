import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FoodDetail from "@/components/storefront/FoodDetail";
import OrderNotes from "@/components/storefront/OrderNotes";
import MoreMenuItems from "@/components/storefront/MoreMenuItems";
import { ApiError } from "@/lib/api/client";
import { getFood, getFoods } from "@/lib/api/menu";
import { buildFoodProductSchema, buildMetadata } from "@/lib/seo";

type FoodPageParams = { params: Promise<{ id: string }> };

async function resolveFood(id: string) {
  const foodId = Number(id);
  if (!Number.isInteger(foodId)) return null;
  return getFood(foodId).catch((err) => {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  });
}

export async function generateMetadata({ params }: FoodPageParams): Promise<Metadata> {
  const { id } = await params;
  const food = await resolveFood(id);
  if (!food) {
    return buildMetadata({
      title: "Food Not Found | Daughter's Delight",
      description: "This dish could not be found. Browse our full homemade menu instead.",
      path: `/food/${id}`,
      noIndex: true,
    });
  }

  const description =
    food.description ??
    `${food.name}, freshly made to order by Daughter's Delight, a home kitchen in Karachi.`;

  return buildMetadata({
    title: `${food.name} | Daughter's Delight`,
    description: description.slice(0, 150),
    path: `/food/${food.id}`,
    image: food.image_url ?? undefined,
  });
}

export default async function FoodPage({ params }: FoodPageParams) {
  const { id } = await params;
  const food = await resolveFood(id);
  if (!food) notFound();

  const relatedFoods = await getFoods({
    category_id: food.category_id,
    available: true,
    limit: 9,
  })
    .then((foods) => foods.filter((f) => f.id !== food.id).slice(0, 8))
    .catch(() => []);

  const productSchema = buildFoodProductSchema({
    id: food.id,
    name: food.name,
    description: food.description,
    price: food.price,
    imageUrl: food.image_url,
    isAvailable: food.is_available,
  });

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <FoodDetail food={food} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <OrderNotes />
      </div>

      <MoreMenuItems foods={relatedFoods} />
    </>
  );
}
