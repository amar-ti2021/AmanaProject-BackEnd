import Event from "../models/Event.js";
import fs from "fs";
import Validator from "../core/Validator.js";
import Mosque from "../models/Mosque.js";
import { nanoid } from "nanoid";

class EventController {
  async index(req, res) {
    const event = await Event.all();
    if (event) {
      const data = {
        message: "Get All event",
        data: event,
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
          description: req.body.description,
          date: req.body.date,
        },
        {
          id: [["unique", "id"]],
          mosque_id: ["required"],
          title: ["required"],
          description: ["required"],
          date: ["required", "date"],
        },
        "events"
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
          errors: "banner is required",
        };
        return res.status(400).json(response);
      }
      data["pic"] = req.file.path;

      const event = await Event.create(data);

      if (event) {
        const response = {
          message: `Data of ${event.name} stored successfully`,
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

    const event = await Event.find(id);
    if (event) {
      const data = {
        message: "Get event with Id " + id,
        data: event,
      };
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "Event not Found" });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const event_data = await Event.find(id);
    if (event_data) {
      try {
        const validator = new Validator();
        const data = await validator.validate(
          {
            title: req.body.title ?? event_data.title,
            description: req.body.description ?? event_data.description,
            date: req.body.date ?? event_data.date,
          },
          {
            title: ["required"],
            description: ["required"],
            date: ["required", "date"],
          },
          "events"
        );
        data["pic"] = event_data.pic;
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
          fs.unlinkSync(event_data.pic);
          data["pic"] = req.file.path;
        }

        const event = await Event.edit(event_data.id, data);

        if (event) {
          const response = {
            message: `Data of ${event.title} stored successfully`,
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
    const event_data = await Event.find(id);
    if (event_data) {
      const event = await Event.delete(id);
      if (event) {
        fs.unlinkSync(event_data.pic);
        const response = {
          message: `Data of ${event_data.title} deleted successfully`,
        };
        return res.status(201).json(response);
      }
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(404).json({ message: "Event Not Found" });
    }
  }

  async search(req, res) {
    const { keyword } = req.params;

    const event = (await Event.where("title", keyword)) ?? [];
    if (event) {
      const data = {
        message: "Get Event with keyword " + keyword,
        data: event,
      };
      return res.status(200).json(data);
    } else {
      return res.status(404).json({ message: "Event not Found" });
    }
  }
}
const object = new EventController();

export default object;
