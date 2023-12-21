import DetailReport from "../models/DetailReport.js";
import fs from "fs";
import Validator from "../core/Validator.js";
import Report from "../models/Report.js";
import { nanoid } from "nanoid";

class DetailReportController {
  async index(req, res) {
    const detail_report = await DetailReport.all();
    if (detail_report) {
      const data = {
        message: "Get All detail_report",
        data: detail_report,
      };

      return res.status(200).json(data);
    } else {
      return res.status(200).json({ message: "Data is Empty" });
    }
  }
  async store(req, res) {
    try {
      const validator = new Validator();
      const report = await Report.find("id", req.body.report_id);
      if (report) {
        const data = await validator.validate(
          {
            id: nanoid(),
            report_id: req.body.report_id,
            type_id: req.body.type_id,
            value: req.body.value,
          },
          {
            id: [["unique", "id"]],
            report_id: ["required"],
            type_id: ["required"],
            value: ["required", "numeric"],
          },
          "report_details"
        );

        if (data.errors) {
          const response = {
            messages: "Validation Error",
            errors: data.errors,
          };
          return res.status(400).json(response);
        }

        const detail_report = await DetailReport.create(data);

        if (detail_report) {
          const response = {
            message: `Data of ${detail_report.name} stored successfully`,
            data: data,
          };
          return res.status(201).json(response);
        }
      } else {
        return res.status(404).json({ message: "Report not Found" });
      }
      return res.status(500).json({ message: "Internal server error" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async show(req, res) {
    const { id } = req.params;

    const detail_report = await DetailReport.find(id);
    if (detail_report) {
      const data = {
        message: "Get detail_report with Id " + id,
        data: detail_report,
      };
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "DetailReport not Found" });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const detail_report_data = await DetailReport.find(id);
    if (detail_report_data) {
      try {
        const validator = new Validator();
        const data = await validator.validate(
          {
            type_id: req.body.type_id ?? detail_report_data.type_id,
            value: req.body.value ?? detail_report_data.value,
          },
          {
            type_id: ["required"],
            value: ["required", "numeric"],
          },
          "report_details"
        );
        if (data.errors) {
          const response = {
            messages: "Validation Error",
            errors: data.errors,
          };
          return res.status(400).json(response);
        }

        const detail_report = await DetailReport.edit(
          detail_report_data.id,
          data
        );

        if (detail_report) {
          const response = {
            message: `Data of ${detail_report.title} stored successfully`,
            data: data,
          };
          return res.status(201).json(response);
        }

        return res.status(500).json({ message: "Internal server error" });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  async destroy(req, res) {
    const { id } = req.params;
    const detail_report_data = await DetailReport.find(id);
    if (detail_report_data) {
      const detail_report = await DetailReport.delete(id);
      if (detail_report) {
        const response = {
          message: `Data of ${detail_report_data.title} deleted successfully`,
        };
        return res.status(201).json(response);
      }
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(404).json({ message: "DetailReport Not Found" });
    }
  }

  async search(req, res) {
    const { keyword } = req.params;

    const detail_report = await DetailReport.where("report_id", keyword);
    if (detail_report) {
      const data = {
        message: "Get DetailReport with keyword " + keyword,
        data: detail_report,
      };
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "DetailReport not Found" });
    }
  }
}
const object = new DetailReportController();

export default object;
