import { nanoid } from "nanoid";
import Validator from "../core/Validator.js";
import Mosque from "../models/Mosque.js";
import Report from "../models/Report.js";

class ReportController {
  async index(req, res) {
    const report = await Report.all();
    if (report) {
      const data = {
        message: "Get All report",
        data: report,
      };

      return res.status(200).json(data);
    } else {
      return res.status(200).json({ message: "Data is Empty" });
    }
  }
  async store(req, res) {
    try {
      const validator = new Validator();
      const mosque = await Mosque.where("user_id", req.user);
      const data = await validator.validate(
        {
          id: nanoid(),
          mosque_id: mosque[0].id,
          title: req.body.title,
          date: req.body.date,
          total: req.body.total,
        },
        {
          id: [["unique", "id"]],
          mosque_id: ["required"],
          title: ["required"],
          total: ["required", "numeric"],
          date: ["required", "date"],
        },
        "reports"
      );

      if (data.errors) {
        const response = {
          messages: "Validation Error",
          errors: data.errors,
        };
        return res.status(400).json(response);
      }
      const report = await Report.create(data);

      if (report) {
        const total = mosque.treasury + report.total;
        console.log(total);
        const response = {
          message: `Data of ${report.title} stored successfully`,
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

  async show(req, res) {
    const { id } = req.params;

    const report = await Report.find(id);
    if (report) {
      const data = {
        message: "Get report with Id " + id,
        data: report,
      };
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "Report not Found" });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const report_data = await Report.find(id);
    if (report_data) {
      try {
        const validator = new Validator();
        const data = await validator.validate(
          {
            title: req.body.title ?? report_data.title,
            date: req.body.date ?? report_data.date,
            total: req.body.total ?? report_data.total,
          },
          {
            title: ["required"],
            total: ["required", "numeric"],
            date: ["required", "date"],
          },
          "reports"
        );
        if (data.errors) {
          const response = {
            messages: "Validation Error",
            errors: data.errors,
          };
          return res.status(400).json(response);
        }

        const report = await Report.edit(report_data.id, data);

        if (report) {
          const response = {
            message: `Data of ${report.title} stored successfully`,
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
    const report_data = await Report.find(id);
    if (report_data) {
      const report = await Report.delete(id);
      if (report) {
        const response = {
          message: `Data of ${report_data.title} deleted successfully`,
        };
        return res.status(201).json(response);
      }
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(404).json({ message: "Report Not Found" });
    }
  }

  async search(req, res) {
    const { keyword } = req.params;

    const report = await Report.where("title", keyword);

    if (report) {
      const data = {
        message: "Get Report with keyword " + keyword,
        data: report,
      };
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "Report not Found" });
    }
  }
}
const object = new ReportController();

export default object;
