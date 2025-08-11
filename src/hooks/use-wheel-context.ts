import { useContext } from "react";
import { WheelContext } from "../context/wheel-context";

export default function useWheelContext() {
    return useContext(WheelContext)
}
