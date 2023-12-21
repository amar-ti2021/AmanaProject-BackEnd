import { nanoid } from "nanoid";
import Validator from "../core/Validator.js";
import Mosque from "../models/Mosque.js";
import Takmir from "../models/Takmir.js";
import fs from "fs";

class TakmirController {
  async getWebadmin(req, res) {
    const validator = new Validator();
    const mosque = await Mosque.where("user_id", req.user);
    const takmir = await Takmir.where("mosque_id", mosque[0].id);
    return res.status(200).json({ takmir: takmir[0], mosque: mosque[0] });
  }
  async index(req, res) {
    const takmir = await Takmir.all();
    if (takmir) {
      const data = {
        message: "Get All takmir",
        data: takmir,
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
          name: req.body.name,
          position_id: "ahF1RZyCQZw0Zfl7EWpSF",
          phone: req.body.phone,
          is_webadmin: 1,
        },
        {
          id: [["unique", "id"]],
          mosque_id: ["required"],
          name: ["required"],
          position_id: ["required"],
          phone: ["required", "numeric"],
          is_webadmin: ["required"],
        },
        "takmirs"
      );

      if (data.errors) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        const response = {
          messages: "Validation Error",
          errors: data.errors,
        };
        return res.status(400).json(response);
      }
      if (!req.file) {
        const response = {
          messages: "Validation Error",
          errors: "picture is required",
        };
        return res.status(400).json(response);
      }

      data["pic"] = req.file.path;

      const takmir = await Takmir.create(data);

      if (takmir) {
        const response = {
          message: `Data of ${takmir.name} stored successfully`,
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

    const takmir = await Takmir.find(id);
    if (takmir) {
      const data = {
        message: "Get takmir with Id " + id,
        data: takmir,
      };
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "Takmir not Found" });
    }
  }

  async update(req, res) {
    const validator = new Validator();
    const { id } = req.params;
    const takmir_data = await Takmir.find(id);
    if (takmir_data) {
      try {
        const validator = new Validator();
        const data = await validator.validate(
          {
            name: req.body.name ?? takmir_data.name,
            position_id: req.body.position_id ?? takmir_data.position_id,
            phone: req.body.phone ?? takmir_data.phone,
            is_webadmin: req.body.is_webadmin ?? takmir_data.is_webadmin,
          },
          {
            name: ["required"],
            position_id: ["required"],
            phone: ["required", "numeric"],
            is_webadmin: ["required"],
          },
          "takmirs"
        );
        data["pic"] = takmir_data.pic;
        if (data.errors) {
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          const response = {
            messages: "Validation Error",
            errors: data.errors,
          };
          return res.status(400).json(response);
        }

        if (req.file) {
          fs.unlinkSync(takmir_data.pic);
          data["pic"] = req.file.path;
        }

        const takmir = await Takmir.edit(takmir_data.id, data);

        if (takmir) {
          const response = {
            message: `Data of ${takmir.name} stored successfully`,
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
    const takmir_data = await Takmir.find(id);
    if (takmir_data) {
      const takmir = await Takmir.delete(id);
      if (takmir) {
        fs.unlinkSync(takmir_data.pic);
        const response = {
          message: `Data of ${takmir_data.name} deleted successfully`,
        };
        return res.status(201).json(response);
      }
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(404).json({ message: "Takmir Not Found" });
    }
  }

  async search(req, res) {
    const { keyword } = req.params;

    const takmir = await Takmir.where("name", keyword);
    if (takmir) {
      const data = {
        message: "Get Takmir with keyword " + keyword,
        data: takmir,
      };
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "Takmir not Found" });
    }
  }
}
const object = new TakmirController();

export default object;
