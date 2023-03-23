import React, { useContext } from "react";

export type Features = "advancedMenu";

export interface IVariantContext {
    namespace: "translation" | "image_4_9" | "image_adv";
    advancedMenu?: boolean;
    modelSelect?: boolean;
    modelThreshold?: boolean;
    trainingStep?: boolean;
    behavioursStep?: boolean;
    imageBehaviours?: boolean;
    soundBehaviours?: boolean;
    textBehaviours?: boolean;
    speechBehaviours?: boolean;
    sampleUploadFile?: boolean;
    classLimit?: number;
    showModelExport?: boolean;
    disabledClassRemove?: boolean;
    disableAddClass?: boolean;
    initialClasses?: string[];
    disableClassNameEdit?: boolean;
    multipleBehaviours?: boolean;
}

export const VariantContext = React.createContext<IVariantContext>({
    namespace: "translation",
});

export function useVariant() {
    return useContext(VariantContext);
}