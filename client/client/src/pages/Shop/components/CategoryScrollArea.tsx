import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface ICategories {
    categories: string[],
    setCategory: React.Dispatch<React.SetStateAction<string>>
}

const CategoryScrollArea = ({categories, setCategory}: ICategories) => {
  return (
    <ScrollArea 
    className="
        w-full whitespace-nowrap rounded-md border
    ">
        <div className="flex w-max space-x-5 p-3">
            {categories.map((category) => (
                <Button variant={"secondary"} onClick={() => setCategory(category)}>{category}</Button>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}   

export default CategoryScrollArea