import Validator from "../core/Validator.js";
import Mosque from "../models/Mosque.js";
import JummahPrayer from "../models/JummahPrayer.js";

class JummahPrayerController {
  async index(req, res) {
    const jummah_prayer = await JummahPrayer.all();
    if (jummah_prayer) {
      const data = {
        message: "Get All jummah_prayer",
        data: jummah_prayer,
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
          mosque_id: mosque.id,
          imam_id: req.body.imam_id,
          bilal_id: req.body.bilal_id,
          khatib_id: req.body.khatib_id,
          date: req.body.date,
        },
        {
          id: [["unique", "id"]],
          mosque_id: ["required"],
          imam_id: ["required"],
          bilal_id: ["required"],
          khatib_id: ["required"],
          date: ["required", "date"],
        },
        "jummah_prayers"
      );

      if (data.errors) {
        const response = {
          messages: "Validation Error",
          errors: data.errors,
        };
        return res.status(400).json(response);
      }

      const jummah_prayer = await JummahPrayer.create(data);

      if (jummah_prayer) {
        const response = {
          message: `Data of ${jummah_prayer.id} stored successfully`,
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

    const jummah_prayer = await JummahPrayer.find(id);
    if (jummah_prayer) {
      const data = {
        message: "Get jummah_prayer with Id " + id,
        data: jummah_prayer,
      };
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "JummahPrayer not Found" });
    }
  }

  async update(req, res) {
    const jummah_prayer_data = await JummahPrayer.find(id);
    if (jummah_prayer_data) {
      try {
        const validator = new Validator();
        const data = await validator.validate(
          {
            imam_id: req.body.imam_id ?? jummah_prayer_data.imam_id,
            bilal_id: req.body.bilal_id ?? jummah_prayer_data.bilal_id,
            khatib_id: req.body.khatib_id ?? jummah_prayer_data.khatib_id,
            date: req.body.date ?? jummah_prayer_data.date,
          },
          {
            imam_id: ["required"],
            bilal_id: ["required"],
            khatib_id: ["required"],
            date: ["required", "date"],
          },
          "jummah_prayers"
        );
        if (data.errors) {
          const response = {
            messages: "Validation Error",
            errors: data.errors,
          };
          return res.status(400).json(response);
        }

        const jummah_prayer = await JummahPrayer.edit(
          jummah_prayer_data.id,
          data
        );

        if (jummah_prayer) {
          const response = {
            message: `Data of ${jummah_prayer.id} stored successfully`,
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
    const jummah_prayer_data = await JummahPrayer.find(id);
    if (jummah_prayer_data) {
      const jummah_prayer = await JummahPrayer.delete(id);
      if (jummah_prayer) {
        const response = {
          message: `Data of ${jummah_prayer_data.name} deleted successfully`,
        };
        return res.status(201).json(response);
      }
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(404).json({ message: "JummahPrayer Not Found" });
    }
  }

  async search(req, res) {
    const { keyword } = req.params;

    const jummah_prayer = await JummahPrayer.where("mosque_id", keyword);
    if (jummah_prayer) {
      const data = {
        message: "Get JummahPrayer with keyword " + keyword,
        data: jummah_prayer,
      };
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "JummahPrayer not Found" });
    }
  }
}
const object = new JummahPrayerController();

export default object;
