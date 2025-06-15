import SubcategoryContainer from "@/app/admin/subcategory/_components/subcategoryContainer";

 

 

export const metadata = {
  title: "Category",
  description:
    "Add or delete categories and see details about existing categories",
};

export default function page() {
  return <SubcategoryContainer />;
}
