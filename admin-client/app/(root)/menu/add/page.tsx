import AddMenuItemForm from "@/components/forms/AddMenuItemForm";
import QueryWrapper from "@/components/providers/query-wrapper";

export default function AddMenuPage() {
  return (
    <section className="w-full flex flex-col gap-y-8">
      <div className="flex justify-start items-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
          Add Menu Item
        </h2>
      </div>
      <QueryWrapper>
        <AddMenuItemForm />
      </QueryWrapper>
    </section>
  );
}
