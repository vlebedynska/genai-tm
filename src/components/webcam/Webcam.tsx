import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Webcam as TMWebcam } from '@teachablemachine/image';
import style from './webcam.module.css';
import { Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useVariant } from '../../util/variant';

interface Props {
    interval?: number;
    capture?: boolean;
    disable?: boolean;
    onCapture?: (image: HTMLCanvasElement) => void;
}

export function Webcam({ interval, capture, onCapture, disable }: Props) {
    const { namespace } = useVariant();
    const { t } = useTranslation(namespace);
    const [webcam, setWebcam] = useState<TMWebcam | null>(null);
    const webcamRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef(-1);
    const previousTimeRef = useRef(0);

    const loop = useCallback(
        (timestamp: number) => {
            if (webcam) {
                //if (previousTimeRef.current === 0) {
                //    previousTimeRef.current = timestamp;
                //}
                webcam.update();
                const actualInterval = interval !== undefined ? interval : 1000.0;
                if (capture && onCapture && timestamp - previousTimeRef.current >= actualInterval) {
                    const newImage = document.createElement('canvas');
                    newImage.width = webcam.canvas.width;
                    newImage.height = webcam.canvas.height;
                    const context = newImage.getContext('2d');
                    if (!context) console.error('Failed to get context');
                    context?.drawImage(webcam.canvas, 0, 0);
                    onCapture(newImage);
                    previousTimeRef.current = timestamp;
                }
            }
            requestRef.current = window.requestAnimationFrame(loop);
        },
        [webcam, interval, capture, onCapture]
    );

    async function initWebcam() {
        const newWebcam = new TMWebcam(224, 224, true);
        await newWebcam.setup();
        setWebcam(newWebcam);
    }

    useEffect(() => {
        if (capture) previousTimeRef.current = 0;
    }, [capture]);

    useEffect(() => {
        initWebcam().catch((e) => console.error('No webcam', e));
        return () => {
            if (webcam) {
                webcam.stop();
            }
            if (requestRef.current >= 0) {
                window.cancelAnimationFrame(requestRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (webcam) {
            if (disable) {
                webcam.pause();
            } else {
                webcam.play();
            }
        }
    }, [webcam, disable]);

    useEffect(() => {
        if (webcam && webcamRef.current) {
            while (webcamRef.current.lastChild) {
                webcamRef.current.removeChild(webcamRef.current.lastChild);
            }
            webcamRef.current.appendChild(webcam.canvas);
            webcam.play();
            /*if (requestRef.current >= 0) {
                console.log('Cancel animation', requestRef.current);
                window.cancelAnimationFrame(requestRef.current);
            }
            requestRef.current = window.requestAnimationFrame(loop);*/
        }
    }, [webcamRef, webcam]);

    useEffect(() => {
        if (webcam) {
            if (requestRef.current >= 0) {
                window.cancelAnimationFrame(requestRef.current);
            }
            requestRef.current = window.requestAnimationFrame(loop);
        }
    }, [webcam, loop]);

    return (
        <>
            {!webcam && (
                <Skeleton
                    variant="rounded"
                    width={224}
                    height={224}
                />
            )}
            <div
                data-testid="webcam"
                className={style.container}
                ref={webcamRef}
                role="img"
                aria-label={t<string>('webcam.aria.video')}
            />
        </>
    );
}
