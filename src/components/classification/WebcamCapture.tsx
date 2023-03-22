import React, {useState} from "react";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
// import SettingsIcon from '@mui/icons-material/Settings';
import { Button } from "../button/Button";
import { Webcam } from "../webcam/Webcam";
import style from "./classification.module.css";
import WebcamSettings, { IWebcamSettings } from "./WebcamSettings";
import { useTranslation } from "react-i18next";
import { useVariant } from "../../util/variant";

interface Props {
    visible?: boolean;
    onClose: () => void;
    onCapture: (image: HTMLCanvasElement) => void;
}

export default function WebcamCapture({visible, onCapture, onClose}: Props) {
    const {namespace} = useVariant();
    const {t} = useTranslation(namespace);
    const [capturing, setCapturing] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState<IWebcamSettings>({
        interval: 1,
        delay: 6,
        count: 1,
    });

    return (visible) ? <div data-testid="webcamwindow" className={style.webcamwindow}>
        {(showSettings)
            ? <>
                <WebcamSettings settings={settings} setSettings={setSettings} />
                <div className={style.webcambuttoncontainer}>
                    <Button variant="contained" onClick={() => setShowSettings(false)}>
                        Close
                    </Button>
                </div>
            </>
            : <>
                <div className={style.webcamheader}>
                    <h2>{t("trainingdata.actions.webcam")}</h2>
                    <IconButton data-testid="webcamclose" aria-label="close" onClick={onClose} color="primary" size="small">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>
                <div className={style.webcamcontainer}>
                    <Webcam capture={capturing} onCapture={onCapture} interval={200} />
                </div>
                <div className={style.webcambuttoncontainer}>
                    <Button
                        sx={{flexGrow: 1}}
                        variant="contained"
                        onMouseDown={() => setCapturing(true)}
                        onMouseUp={() => setCapturing(false)}
                        onBlur={() => setCapturing(false)}
                        onMouseLeave={() => setCapturing(false)}
                    >
                        {(capturing) ? t("trainingdata.labels.wait") : t("trainingdata.actions.capture", {seconds: "1"})}
                    </Button>
                    {/*<IconButton aria-label="settings" onClick={() => setShowSettings(true)} color="primary">
                        <SettingsIcon />
                    </IconButton>*/}
                </div>
            </>
        }
    </div> : null;
}