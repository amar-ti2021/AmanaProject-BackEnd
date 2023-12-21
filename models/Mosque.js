import Model from "../core/Model.js";
class Mosque extends Model {
  static table = "mosques";

  static users() {
    this.belongsTo("users");
  }
}

export default Mosque;
