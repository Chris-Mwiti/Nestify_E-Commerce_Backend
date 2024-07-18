import CategoryScrollArea from '@/pages/Shop/components/CategoryScrollArea';
import { ProductMiniProfile } from '@/pages/Shop/components/ProductMiniProfile';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react';
import z from 'zod'

const shopSearchSchema = z.object({
      filterCategory: z.string().catch("all"),
      offset: z.number().optional(),
      take: z.number().catch(10),
    })

export const Route = createFileRoute("/shop")({
  component: POS,
  validateSearch: (search) => shopSearchSchema.parse(search)
    
});

function POS() {
  const [categorySelection,setCateorySection] = useState("all");
  const navigate = Route.useNavigate();
  useEffect(() => {
    navigate({
      search:(old) => ({
        ...old,
        filterCategory: categorySelection
      })
    })

  },[categorySelection])
  return (
    <section className="w-full h-full space-y-12">
      <div
        className="
        w-full space-y-4
      ">
        <p
          className="
          text-lg font-bold text-foregroud
        ">
          Categories
        </p>
        <CategoryScrollArea
          categories={[
            "Spanners",
            "Hammers",
            "Pipes",
            "Tanks",
            "Nails",
            "Pipe Elbows",
            "Tiles",
            "Paints",
            "Nails",
            "Pipe Elbows",
            "Tiles",
            "Paints",
          ]}
          setCategory={setCateorySection}
        />
      </div>
      <div
        className="
        w-full grid
        grid-cols-3
        gap-2
      ">
        <ProductMiniProfile />
        <ProductMiniProfile />
        <ProductMiniProfile />
        <ProductMiniProfile />
      </div>
    </section>
  );
}