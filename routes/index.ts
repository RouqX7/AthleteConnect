import { Routes } from "./routePaths";
import  v1Router from "./v1/v1";

v1Router.get(Routes.health, (req, res) => {
    res.status(200).json({
        message: ' Welcome to TaskFlow v1: Server is up and running',
    });
});

export default  v1Router;