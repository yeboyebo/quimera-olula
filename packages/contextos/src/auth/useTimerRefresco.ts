import { useEffect, useRef } from "react";
import { redirect } from "react-router";
import { comprobarToken } from "./login/dominio.ts";

export const useTimerRefresco = ({ segundos_refresco = 3 }: { segundos_refresco?: number } = {}) => {
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        timerRef.current = setInterval(async () => {
            console.log("Hola amigos")
            await comprobarToken().catch((_e) => {
                throw redirect("/login")
            })
        }, segundos_refresco * 1000);

        return () => {
            clearInterval(timerRef.current!);
        }

    })
};