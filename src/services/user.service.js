import UserDao from "../dao/user.mongodb.dao.js";
import { createHash } from "../utils/utils.js";
import CartService from "./cart.service.js";

export default class UserService {
  static async create(data) {
    const { first_name, last_name, age, email, password } = data;

    if (!first_name || !last_name) {
      throw new Error("Todos los campos excepto edad son requerido");
    }

    const user = await UserDao.getByEmail(email);
    if (user) {
      throw new Error("Ya existe un usuario con esas credenciales");
    }

    const cart = await CartService.create();

    let passwordHashed = createHash(password);

    let newUser = {
      first_name,
      last_name,
      email,
      age,
      password: passwordHashed,
      cart: cart._id,
    };

    try {
      const user = await UserDao.create(newUser);
      return user;
    } catch (error) {
      console.error(error.message);
    }
  }
}