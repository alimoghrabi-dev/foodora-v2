import { redirect } from "next/navigation";

export default async function EditPageRedirector() {
  redirect("/menu");
}
