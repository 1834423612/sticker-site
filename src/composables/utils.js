import pinia from "@/store/store";
import { useAppStore } from "@/store/useAppStore";
const store = useAppStore(pinia);


// 复制
export function handleCopy(text) {
    const input = document.createElement("input");
    input.style.cssText = "opacity: 0;";
    input.type = "text";
    input.value = text;
    input.id = "_copy_input";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.getElementById("_copy_input").remove();
}






