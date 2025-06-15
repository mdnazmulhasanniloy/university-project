"use client";

import { Button, Pagination } from "antd";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import categoryImg from "@/assets/images/categoryImg.png";
import Image from "next/image";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/redux/api/categoryApi";
import { ErrorModal, SuccessModal } from "@/utils/modalHook";
import toast from "react-hot-toast";
import { Spin } from "antd";
import textTruncate from "@/utils/textTruncate";

// Dummy table data
const data = Array.from({ length: 7 }).map((_, inx) => ({
  key: inx + 1,
  name: "Business Service",
  img: categoryImg,
}));

export default function CategoryContainer() {
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const query = {};
  query["page"] = page;
  query["limit"] = limit;
  const {
    data: categoryRes,
    isLoading,
    refetch: refetchCategory,
  } = useGetCategoriesQuery(query);
  const [deleteFn] = useDeleteCategoryMutation();
  const categories = categoryRes?.data?.data || [];

  const handelToDelete = async (id) => {
    toast.loading("Deleting...", { id: "category", duration: 2000 });
    try {
      const res = await deleteFn(id).unwrap();
      SuccessModal(res?.message);
    } catch (error) {
      console.error(error);
      ErrorModal(error?.message || error?.data?.message);
    } finally {
      toast.dismiss("category");
    }
  };

  if (isLoading)
    return (
      <div className="flex-center h-[50vh]">
        <Spin size="large" />
      </div>
    );

  return (
    <div>
      <Button
        type="primary"
        size="large"
        icon={<PlusCircle size={20} />}
        iconPosition="start"
        className="!w-full !py-6"
        onClick={() => setShowCreateCategoryModal(true)}
      >
        Create Category
      </Button>

      {/* Categories */}
      <section className="my-10 grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category._id}
            className="flex flex-col items-center justify-between rounded-xl border border-primary-blue/25 p-4 shadow"
          >
            <>
              <div className="flex-center h-[200px] w-full rounded-lg bg-primary-blue">
                <Image
                  src={category?.banner}
                  alt={`Image of category ${category.name}`}
                  height={1600}
                  width={1600}
                  className="h-[150px] w-auto rounded"
                />
              </div>

              <div className="mb-5 mt-2 space-y-1 text-center">
                <h4 className="text-2xl font-semibold">{category.name}</h4>

                <p className="font-medium text-gray-700">
                  {textTruncate(category.description, 100)}
                </p>
              </div>
            </>

            <div className="flex-center w-full gap-x-3">
              <CustomConfirm
                title="Delete Category"
                description="Are you sure to delete this category?"
                onConfirm={() => handelToDelete(category?._id)}
              >
                <Button className="w-full !bg-danger !text-white">
                  Delete
                </Button>
              </CustomConfirm>

              <Button
                type="primary"
                className="w-full"
                onClick={() => {
                  setShowEditCategoryModal(true), setModalData(category);
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
          total={categoryRes?.data?.meta.total}
          pageSize={limit}
          onChange={(page) => setPage(page)}
          defaultCurrent={1}
          style={{ fontSize: "1.2rem" }}
        />
      </div>

      {/* Create Category Modal */}
      <CreateCategoryModal
        open={showCreateCategoryModal}
        setOpen={setShowCreateCategoryModal}
      />

      {/* Edit category modal */}
      <EditCategoryModal
        open={showEditCategoryModal}
        setOpen={setShowEditCategoryModal}
        modalData={modalData}
        setModalData={setModalData}
        refetchCategory={refetchCategory}
      />
    </div>
  );
}
