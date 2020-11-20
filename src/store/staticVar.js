import { i18n } from "@/i18n.js";

export default {
  getters: {
    searchCategories: () => [
      { label: i18n.t("sectionNumber"), value: "SEC" },
      { label: i18n.t("bedNumber"), value: "BED" },
      { label: i18n.t("patient.chtno"), value: "MR" },
      { label: i18n.t("doctorNumber"), value: "DR" },
      { label: i18n.t("stationNumber"), value: "WARD" }
    ]
  }
};
