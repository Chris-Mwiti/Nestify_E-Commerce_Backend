import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import React, { ReactElement, useDeferredValue, useState } from "react";

const SearchModal = () => {

    const [searchItem,setSearchItem] = useState("");
    const defferedSearchItem = useDeferredValue(searchItem);

    
    return (
      <Dialog>
        <DialogTrigger>
          <div className="w-[300px] p-2 rounded-md flex items-center space-x-2 bg-slate-200">
            <SearchIcon className="stroke-primary size-5" />
            <Input
              placeholder="Search category,product,etc"
              className="border-none shadow-none"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px]  max-h-[400px] overflow-y-scroll h-[400px] rounded-lg">
          <div className="w-[300px] p-2 rounded-md flex items-center space-x-2 fixed">
            <SearchIcon className="stroke-primary size-5" />
            <Input
              placeholder="Search category,product,etc"
              className="border-none shadow-none"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
}

export default SearchModal