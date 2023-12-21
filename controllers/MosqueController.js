import { nanoid } from "nanoid";
import fs from "fs";
import Validator from "../core/Validator.js";
import Mosque from "../models/Mosque.js";

class MosqueController {
  async index(req, res) {
    const mosque = await Mosque.all();
    if (mosque) {
      const data = {
        message: "Get All mosque",
        data: mosque,
      };

      return res.status(200).json(data);
    } else {
      return res.status(200).json({ message: "Data is Empty" });
    }
  }
  async store(req, res) {
    try {
      console.log(req);
      const validator = new Validator();
      const data = await validator.validate(
        {
          id: nanoid(),
          user_id: req.user,
          name: req.body.name,
          address: req.body.address,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          phone: req.body.phone,
          treasury: 1,
        },
        {
          id: [["unique", "id"]],
          user_id: ["required", ["unique", "user_id"]],
          name: ["required"],
          address: ["required"],
          latitude: ["required"],
          longitude: ["required"],
          phone: ["required", "numeric"],
          treasury: ["required", "numeric"],
        },
        "mosques"
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

      const mosque = await Mosque.create(data);

      if (mosque) {
        const response = {
          message: `Data of ${mosque.name} stored successfully`,
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

    const mosque = await Mosque.find(id);
    if (mosque) {
      const data = {
        message: "Get mosque with Id " + id,
        data: mosque,
      };
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "Mosque not Found" });
    }
  }

  async update(req, res) {
    const validator = new Validator();
    const { id } = req.params;
    const mosque_data = await Mosque.find(id);
    if (mosque_data) {
      try {
        const validator = new Validator();
        const data = await validator.validate(
          {
            name: req.body.name ?? mosque_data.name,
            address: req.body.address ?? mosque_data.address,
            latitude: req.body.latitude ?? mosque_data.latitude,
            longitude: req.body.longitude ?? mosque_data.longitude,
            phone: req.body.phone ?? mosque_data.phone,
            treasury: req.body.treasury ?? mosque_data.treasury,
          },
          {
            name: ["required"],
            address: ["required"],
            latitude: ["required"],
            longitude: ["required"],
            phone: ["required", "numeric"],
            treasury: ["required", "numeric"],
          },
          "mosques"
        );
        data["pic"] = mosque_data.pic;
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
          fs.unlinkSync(mosque_data.pic);
          data["pic"] = req.file.path;
        }

        const mosque = await Mosque.edit(mosque_data.id, data);

        if (mosque) {
          const response = {
            message: `Data of ${mosque.name} stored successfully`,
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
    const mosque_data = await Mosque.find(id);
    if (mosque_data) {
      const mosque = await Mosque.delete(id);
      if (mosque) {
        fs.unlinkSync(mosque_data.pic);
        const response = {
          message: `Data of ${mosque_data.name} deleted successfully`,
        };
        return res.status(201).json(response);
      }
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(404).json({ message: "Mosque Not Found" });
    }
  }

  async search(req, res) {
    const { keyword } = req.params;

    const mosqueByName = (await Mosque.where("name", keyword)) ?? [];
    const mosqueByLocation = await Mosque.where("address", keyword);
    const unfilteredMosque = mosqueByName.concat(mosqueByLocation);
    const mosque = [
      ...new Map(unfilteredMosque.map((m) => [m.id, m])).values(),
    ];
    if (mosque) {
      const data = {
        message: "Get Mosque with keyword " + keyword,
        data: mosque,
      };
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "Mosque not Found" });
    }
  }
  async check(req, res) {
    const mosque = await Mosque.where("user_id", req.user);
    if (mosque) {
      return res.status(200).json({ message: "mosque is registered" });
    }
    return res.status(404).json({ message: "Mosque is not registered" });
  }
}
const object = new MosqueController();

export default object;
