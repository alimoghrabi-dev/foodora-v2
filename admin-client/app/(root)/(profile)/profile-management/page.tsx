import QueryWrapper from "@/components/providers/query-wrapper";
import ProfileManagementQueryMapper from "@/components/query-mappers/ProfileManagementQueryMapper";
import { getRestaurantSession } from "@/lib/get-user";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foodora Admin | Profile Management",
};

export default async function ProfileManagementPage() {
  const restaurant = await getRestaurantSession();

  const data = {
    name: restaurant?.name,
    description: restaurant?.description,
    cuisine: restaurant?.cuisine,
    address: restaurant?.address,
    phoneNumber: restaurant?.phoneNumber,
    website: restaurant?.website,
    logo: restaurant?.logo,
    coverImage: restaurant?.coverImage,
  };

  return (
    <div className="w-full flex flex-col gap-y-5">
      <h2 className="text-xl sm:text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
        Manage Your Restaurant
      </h2>
      <QueryWrapper>
        <ProfileManagementQueryMapper data={data} />
      </QueryWrapper>
    </div>
  );
}
