"use client";

import { Button, ConfigProvider, Pagination, Segmented } from "antd";
import { ChevronLeft, ChevronRight, PlusCircleIcon } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { ErrorModal, SuccessModal } from "@/utils/modalHook";
import toast from "react-hot-toast";
import {
  useDeleteSubcategoryMutation,
  useGetSubcategoriesQuery,
} from "@/redux/api/subcategoryApi";
import EditSubcategoryModal from "./EditSubcategoryModal";
import CreateSubcategoryModal from "./CreateSubcategoryModal";

export default function SubcategoryContainer() {
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const query = {};
  query["page"] = page;
  query["limit"] = limit;
  if (selectedCategory) query["category"] = selectedCategory?._id;
  const { data: subcategoryRes, isLoading } = useGetSubcategoriesQuery(query);
  const categoryQuery = {};
  categoryQuery["limit"] = 999999999999999;
  const { data: categoryRes, isLoadingCategory } =
    useGetCategoriesQuery(categoryQuery);
  const [deleteFn] = useDeleteSubcategoryMutation();
  const subcategories = subcategoryRes?.data?.data || [];
  const categories = categoryRes?.data?.data || [];

  // ------------------- Slider navigation buttons --------------------- //
  const scrollContainerRef = useRef(null);
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -100, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  };

  const handelToDelete = async (id) => {
    toast.loading("Deleting...", { id: "category", duration: 2000 });
    try {
      const res = await deleteFn(id).unwrap();
      SuccessModal(res?.message);
    } catch (error) {
      console.error(error);
      ErrorModal(error?.message || error?.data?.message);
    }
  };

  return (
    <div>
      <Button
        type="primary"
        size="large"
        icon={<PlusCircleIcon size={20} />}
        iconPosition="start"
        className="!w-full !py-6"
        onClick={() => setShowCreateCategoryModal(true)}
      >
        Create Subcategory
      </Button>

      {/* Categories */}

      <div className="">
        {categories?.length > 0 && (
          <div
            style={{ padding: "20px", display: "flex", alignItems: "center" }}
          >
            <Button
              className="bg-[#1b71a7]"
              icon={<ChevronLeft />}
              onClick={handleScrollLeft}
            />
            <div
              ref={scrollContainerRef}
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
                flex: 1,
                margin: "0 10px 0  10px",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <ConfigProvider
                theme={{
                  components: {
                    Segmented: {
                      itemSelectedBg: "#1b71a7",
                      itemSelectedColor: "white",
                    },
                  },
                }}
              >
                <Segmented
                  options={[
                    "All Categories",
                    ...categories?.map((category) => category.name),
                  ]}
                  size="large"
                  onChange={(value) => {
                    if (value === "All Categories") {
                      setSelectedCategory(null);
                    } else {
                      setSelectedCategory(
                        categories?.find(
                          (category) =>
                            category?.name?.toLowerCase() ===
                            value.toLowerCase(),
                        ),
                      );
                    }
                  }}
                  defaultValue={"All Categories"}
                />
              </ConfigProvider>
            </div>
            <Button
              className="bg-[#1b71a7]"
              icon={<ChevronRight />}
              onClick={handleScrollRight}
            />
          </div>
        )}
      </div>
      <section className="my-10 grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {subcategories.map((subcategory) => (
          <div
            key={subcategory._id}
            className="flex flex-col items-center rounded-xl border border-primary-blue/25 p-4 shadow"
          >
            <Image
              src={subcategory?.banner}
              alt={`Image of category ${subcategory.name}`}
              height={1600}
              width={1600}
              className="h-[200px] w-auto rounded"
            />

            <h4 className="mt-2 text-2xl font-semibold">{subcategory.name}</h4>
            <h4 className="mb-5 mt-2 text-lg">
              Category: <strong> {subcategory.category?.name}</strong>
            </h4>

            <div className="flex-center w-full gap-x-3">
              <CustomConfirm
                title="Delete Category"
                description="Are you sure to delete this category?"
                onConfirm={() => handelToDelete(subcategory?._id)}
              >
                <Button className="w-full !bg-danger !text-white">
                  Delete
                </Button>
              </CustomConfirm>

              <Button
                type="primary"
                className="w-full"
                onClick={() => {
                  setShowEditCategoryModal(true), setModalData(subcategory);
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </section>

      <div className="my-10 ml-auto max-w-max">
        <Pagination
          total={subcategoryRes?.data?.meta.total}
          pageSize={limit}
          onChange={(page) => setPage(page)}
          defaultCurrent={1}
          style={{ fontSize: "1.2rem" }}
        />
      </div>

      {/* Create Category Modal */}
      <CreateSubcategoryModal
        open={showCreateCategoryModal}
        setOpen={setShowCreateCategoryModal}
      />

      {/* Edit category modal */}
      <EditSubcategoryModal
        open={showEditCategoryModal}
        setOpen={setShowEditCategoryModal}
        modalData={modalData}
        setModalData={setModalData}
      />
    </div>
  );
}
