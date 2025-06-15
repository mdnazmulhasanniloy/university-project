export const getTagColor = (value) => {
  switch (value) {
    case "pending":
      return "geekblue-inverse";
    case "approved":
      return "green-inverse";
    case "rejected":
      return "red-inverse";
    default:
      return "geekblue";
  }
};
