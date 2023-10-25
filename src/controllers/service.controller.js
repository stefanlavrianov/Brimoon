import { getConnection } from "../database/database";

const getServices = async (req, res) => {
    try {
        const {fechaInicio, fechaFin} = req.body;

        let sql = "SELECT * FROM servicios WHERE 1=1 ";

        // Agrega la condición para fechaInicio si no es NULL
        if (fechaInicio !== null) {
            sql += `AND fecha >= '${fechaInicio}'`;
        }

        // Agrega la condición para fechaFin si no es NULL
        if (fechaFin !== null) {
            // Si ya se agregó la condición de fechaInicio, agrega un operador lógico
            if (fechaInicio !== null) {
                sql += " AND";
            }
            sql += ` fecha <= '${fechaFin}'`;
        }

        const connection = await getConnection();
        const result = await connection.query(sql);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getService = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM servicios WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const addService = async (req, res) => {
    try {
        const {servicio, metodo_pago, de_quien, porcentaje_primero, total_primero, para_quien, porcentaje_segundo, total_segundo, precio, fecha } = req.body;

        if (fecha === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const service = {servicio, metodo_pago, de_quien, porcentaje_primero, total_primero, para_quien, porcentaje_segundo, total_segundo, precio, fecha};
        const connection = await getConnection();
        await connection.query("INSERT INTO servicios SET ?", service);
        res.json({ message: "Services added" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, programmers } = req.body;

        if (id === undefined || name === undefined || programmers === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
        }

        const language = { name, programmers };
        const connection = await getConnection();
        const result = await connection.query("UPDATE language SET ? WHERE id = ?", [language, id]);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM servicios WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {
    getServices,
    getService,
    addService,
    updateService,
    deleteService
};
