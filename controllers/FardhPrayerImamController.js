import Validator from "../core/Validator.js";
import Mosque from "../models/Mosque.js";
import FardhPrayerImam from "../models/FardhPrayerImam.js";

class FardhPrayerImamController {
  async index(req, res) {
    const fardh_prayer_imam = await FardhPrayerImam.all();
    if (fardh_prayer_imam) {
      const data = {
        message: "Get All fardh prayer imam",
        data: fardh_prayer_imam,
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
          fajr_imam_id: req.body.fajr_imam_id,
          dhuhr_imam_id: req.body.dhuhr_imam_id,
          asr_imam_id: req.body.asr_imam_id,
          maghrib_imam_id: req.body.maghrib_imam_id,
          isha_imam_id: req.body.isha_imam_id,
          date: req.body.date,
        },
        {
          id: [["unique", "id"]],
          mosque_id: ["required"],
          fajr_imam_id: ["required"],
          dhuhr_imam_id: ["required"],
          asr_imam_id: ["required"],
          maghrib_imam_id: ["required"],
          isha_imam_id: ["required"],
          date: ["required", "date"],
        },
        "fardh_prayer_imams"
      );

      if (data.errors) {
        const response = {
          messages: "Validation Error",
          errors: data.errors,
        };
        return res.status(400).json(response);
      }

      const fardh_prayer_imam = await FardhPrayerImam.create(data);

      if (fardh_prayer_imam) {
        const response = {
          message: `Data of ${fardh_prayer_imam.id} stored successfully`,
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

    const fardh_prayer_imam = await FardhPrayerImam.find(id);
    if (fardh_prayer_imam) {
      const data = {
        message: "Get fardh prayer imam with Id " + id,
        data: fardh_prayer_imam,
      };
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "FardhPrayerImam not Found" });
    }
  }

  async update(req, res) {
    const fardh_prayer_imam_data = await FardhPrayerImam.find(id);
    if (fardh_prayer_imam_data) {
      try {
        const validator = new Validator();
        const data = await validator.validate(
          {
            fajr_imam_id:
              req.body.fajr_imam_id ?? fardh_prayer_imam_data.fajr_imam_id,
            dhuhr_imam_id:
              req.body.dhuhr_imam_id ?? fardh_prayer_imam_data.dhuhr_imam_id,
            asr_imam_id:
              req.body.asr_imam_id ?? fardh_prayer_imam_data.asr_imam_id,
            maghrib_imam_id:
              req.body.maghrib_imam_id ??
              fardh_prayer_imam_data.maghrib_imam_id,
            isha_imam_id:
              req.body.isha_imam_id ?? fardh_prayer_imam_data.isha_imam_id,
            date: req.body.date ?? fardh_prayer_imam_data.date,
          },
          {
            fajr_imam_id: ["required"],
            dhuhr_imam_id: ["required"],
            asr_imam_id: ["required"],
            maghrib_imam_id: ["required"],
            isha_imam_id: ["required"],
            date: ["required", "date"],
          },
          "fardh_prayer_imams"
        );
        if (data.errors) {
          const response = {
            messages: "Validation Error",
            errors: data.errors,
          };
          return res.status(400).json(response);
        }

        const fardh_prayer_imam = await FardhPrayerImam.edit(
          fardh_prayer_imam_data.id,
          data
        );

        if (fardh_prayer_imam) {
          const response = {
            message: `Data of ${fardh_prayer_imam.id} stored successfully`,
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
    const fardh_prayer_imam_data = await FardhPrayerImam.find(id);
    if (fardh_prayer_imam_data) {
      const fardh_prayer_imam = await FardhPrayerImam.delete(id);
      if (fardh_prayer_imam) {
        const response = {
          message: `Data of ${fardh_prayer_imam_data.name} deleted successfully`,
        };
        return res.status(201).json(response);
      }
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(404).json({ message: "FardhPrayerImam Not Found" });
    }
  }

  async search(req, res) {
    const { keyword } = req.params;

    const fardh_prayer_imam = await FardhPrayerImam.where("mosque_id", keyword);
    if (fardh_prayer_imam) {
      const data = {
        message: "Get FardhPrayerImam with keyword " + keyword,
        data: fardh_prayer_imam,
      };
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "FardhPrayerImam not Found" });
    }
  }
}
const object = new FardhPrayerImamController();

export default object;
