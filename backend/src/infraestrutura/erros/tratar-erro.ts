// src/utils/tratarErro.ts
import { Response } from "express";
import { HttpErro } from "./http-error";

export function TratarErro(res: Response, error: any, contexto: string): void {
    console.error(`${contexto}:`, error?.message || error);

    if (error instanceof HttpErro) {
        res.status(error.status).json({
            success: false,
            message: error.message,
            details: error.details || null,
        });
    } else {
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
        });
    }
}