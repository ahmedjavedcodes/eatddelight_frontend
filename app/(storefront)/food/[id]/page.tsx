import { notFound } from "next/navigation";
import FoodDetail from "@/components/storefront/FoodDetail";
import OrderNotes from "@/components/storefront/OrderNotes";
import MoreMenuItems from "@/components/storefront/MoreMenuItems";
import { ApiError } from "@/lib/api/client";
import { getFood, getFoods } from "@/lib/api/menu";

export default async function FoodPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const foodId = Number(id);
    if (!Number.isInteger(foodId)) notFound();

    const food = await getFood(foodId).catch((err) => {
      if (err instanceof ApiError && err.status === 404) notFound();
      throw err;
    });

    const relatedFoods = await getFoods({
      category_id: food.category_id,
      available: true,
      limit: 9,
    })
      .then((foods) => foods.filter((f) => f.id !== food.id).slice(0, 8))
      .catch(() => []);

    return (
      <>
        <FoodDetail food={food} />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <OrderNotes />
        </div>

        <MoreMenuItems foods={relatedFoods} />
      </>
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    notFound();
  }
}
