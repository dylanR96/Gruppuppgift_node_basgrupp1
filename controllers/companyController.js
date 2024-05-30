import db from "../db/database.js";
import menu from "../services/menu.js";
import airbeanInfo from "../services/companyInfo.js";

const getMenu = async (req, res) => {
  try {
    const menuData = await db["company"].findOne({ type: "menu" });

    if (!menuData) {
      const insertedData = await db["company"].insert({
        type: "menu",
        data: menu,
      });
      return res.status(201).json(insertedData);
    } else {
      return res.status(200).json(result.data);
    }
  } catch (err) {
    return res.status(500).send({ error: "Error accessing menu" });
  }
};

const getCompanyInfo = async (req, res, next) => {
  try {
    const companyData = await db["company"].findOne({ type: "airbeanInfo" });

    if (!companyData) {
      const insertedData = await db["company"].insert({
        type: "airbeanInfo",
        data: airbeanInfo,
      });
      return res.status(201).json(insertedData);
    } else {
      return res.status(201).json(insertedData);
    }
  } catch (err) {
    return res.status(500).send({ error: "Error accessing company info" });
  }
};

export { getMenu, getCompanyInfo };
