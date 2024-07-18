import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

type TProductSizes = "XL" | "M" | "LG" | "S";

export const ProductMiniProfile = () => {
  const sizes: TProductSizes[] = ["XL", "S", "M", "LG"];
  const [selectedSize, setSelectedSize] = useState<TProductSizes>("S");
  const [amount, setAmount] = useState(0);

  const increaseAmount = () => {
    setAmount((prev) => ++prev);
  }

  const decreaseAmount = () => {
    setAmount((prev) => prev == 0 ? prev : --prev);
  }
  return (
    <Card
      className="
        w-full
        2xl:w-[500px]
        md:w-[350px]
    ">
      <CardHeader>
        <CardContent className="space-y-5 p-0">
          <CardTitle>
            <div
              className="
                    w-full flex space-x-3
                ">
              <span
                className="
                        size-24 rounded-md border
                    ">
                {/* @todo:Create a utility image for the images */}
                <img
                  src="/hammer2.webp"
                  className="size-full object-cover rounded-md"
                />
              </span>
              <div className="space-y-3">
                <p className="text-lg font-bold text-primary">Hammer</p>
                <p className="text-sm font-medium text-muted-foreground">
                  34 units available
                </p>
              </div>
            </div>
          </CardTitle>
          <span
            className="
            w-full
            flex space-y-3 flex-col
            2xl:flex-row
            2xl:space-x-7
            2xl:items-center
            ">
            <span className="space-y-3">
              <p className="font-medium">Sizes</p>
              <div className="flex items-center space-x-3 w-full">
                {sizes.map((size) => (
                  <Button
                    className={`size-12 flex justify-center items-center rounded-full border ${size === selectedSize ? "bg-primary/40 ring-1 ring-primary" : ""}`}
                    variant={"secondary"}
                    onClick={() => setSelectedSize(size)}>
                    {size}
                  </Button>
                ))}
              </div>
            </span>
            <span
              className="
                items-center space-y-2
            ">
              <p className="font-medium text-foreground">Amount</p>
              <div className="flex items-center space-x-3">
                <Button
                  className="size-12 flex items-center jusstify-center rounded-full"
                  variant={"secondary"}
                  onClick={increaseAmount}>
                  <Plus className="size-5" />
                </Button>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  className="
                    w-[70px]
                "
                />
                <Button
                  className="size-12 flex items-center jusstify-center rounded-full"
                  variant={"secondary"}
                  onClick={decreaseAmount}>
                  <Minus className="size-5" />
                </Button>
              </div>
            </span>
          </span>
          <Button className="w-full rounded-md bg-primary">Add to cart</Button>
        </CardContent>
      </CardHeader>
    </Card>
  );
};
