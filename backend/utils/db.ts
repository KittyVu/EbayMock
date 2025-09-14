import { Sequelize } from "sequelize";

const sequelize = new Sequelize("postgres://xuyen:123456!@localhost:5432/onlineshopping", {logging: false});

export default sequelize;