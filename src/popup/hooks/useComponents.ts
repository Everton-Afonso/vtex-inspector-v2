import { useEffect, useState } from "react";

import { sendMessage } from "../services/chrome";
import type { Apps } from "../../types/components";

export function useComponents(): Apps {
    const [components, setComponents] = useState<Apps>({});

    useEffect(() => {
        sendMessage<Apps>({
            type: "GET_COMPONENTS",
        }).then((response) => {
            setComponents(response ?? {});
        });
    }, []);

    return components;
}