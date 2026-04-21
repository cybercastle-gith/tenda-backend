import { Router } from "express";
import multer from "multer";
import uploadConfig from "../../shared/config/multer";
import { create } from "./controller/FaturaControlador";

const upload = multer(uploadConfig);
const rotasFatura = Router();

rotasFatura.post("/enviar/fatura", upload.single("fatura"), create);

export default rotasFatura;
