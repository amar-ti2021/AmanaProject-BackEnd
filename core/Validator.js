import db from './Database.js';

class Validator {
  static table;

  async validate(data, rules, table = "") {
    this.table = table;
    let isValid = true;
    let error = [];
    const validationPromises = [];

    for (const [key, value] of Object.entries(rules)) {
      let element = data[key];

      for (const rule of value) {
        switch (true) {
          case rule == "required":
            if (!this.required(element)) {
              error.push(`${key} wajib diisi`);
              isValid = false;
            }
            break;
          case rule == "numeric":
            if (!this.numeric(element)) {
              error.push(`${key} harus berupa angka`);
              isValid = false;
            }
            break;
          case rule == "date":
            if (!this.date(element)) {
              error.push(`${key} harus berupa tanggal yang valid`);
              isValid = false;
            } else {
              data[key] = new Date(element);
            }
            break;
          case rule == "email":
            if (!Validator.isValidEmail(element)) {
              error.push(`${key} harus berupa email yang valid`);
              isValid = false;
            }
            break;
          case rule == "strong_password":
            const missingCriteria = this.strongPassword(element);
            if (missingCriteria.length > 0) {
              error.push(`${key} harus mengandung: ${missingCriteria.join(", ")}`);
              isValid = false;
            }
            break;
          case rule instanceof Array:
            if (rule[0] == "unique") {
              // Capture the result of unique and log it
              const notUnique = await this.unique(rule[1], element);
              if (notUnique) {
                error.push(`${key} tidak dapat digunakan`);
                isValid = false;
              }
              validationPromises.push(notUnique);
            } else if (rule[0] == "match") {
              if (!this.match(data[rule[1]], element)) {
                error.push(`${key} harus sama dengan ${rule[1]}`);
                isValid = false;
              }
            }
            break;
          default:
            break;
        }
      }
    }

    await Promise.all(validationPromises);

    if (!isValid) {
      return { errors: error };
    }
    return data;
  }

  async unique(field, data) {
    try {
      const query = `SELECT * FROM ${this.table} WHERE ${field} = ?`;
      const results = await db(query, [data]);
      return results.length > 0 ? true : false;
    } catch (error) {
      throw new Error("Error saat mengambil data: " + error.message);
    }
  }
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  match(key, data) {
    return key == data ? true : false;
  }

  required(data) {
    return Boolean(data);
  }

  numeric(data) {
    return !isNaN(data);
  }

  date(data) {
    data = Date.parse(data);
    return this.numeric(data);
  }
  strongPassword(data) {
    const missingCriteria = [];

    if (data.length < 8) {
      missingCriteria.push("minimal 8 karakter");
    }

    if (!/(?=.*[a-z])/.test(data)) {
      missingCriteria.push("minimal 1 huruf kecil");
    }

    if (!/(?=.*[A-Z])/.test(data)) {
      missingCriteria.push("minimal 1 huruf besar");
    }

    if (!/(?=.*\d)/.test(data)) {
      missingCriteria.push("minimal 1 angka");
    }

    return missingCriteria;
  }
}

export default Validator;
