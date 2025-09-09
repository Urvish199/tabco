import { api } from "./api";

export const getCatalogProduct = async (
  id: string,
  data?: {
    QualId?: string;
    ProductId?: string;
  }
) => {
  try {
    const { data } = await api.post(`/QRPortal/GetQualByQrId`, {
      id,
      QualId: "165",
      type: "Catelog",
    },{  headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },});
    return { success: true, message: data?.message, data: data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Somthing went wrong",
      data: [],
    };
  }
};
// params.append("Id", idParam);
//         params.append("QualId", qualIdParam);
//         params.append("ProductId", productIdParam);
//         if (isCatelog) {
//           params.append("type", "Catelog");
//         }

// export const getExtraCatalogProduct = async ({
//   ReportId: string,
//   QualId: string,
//   ProductId: string,
// }) => {
//   try {
//     const { data } = await api.post(`/QRPortal/GetQualByQrId`, {
//       ReportId,
//       QualId,
//       ProductId,
//     });
//     return { success: true, message: data?.message, data: data };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error?.message || "Somthing went wrong",
//       data: [],
//     };
//   }
// };
