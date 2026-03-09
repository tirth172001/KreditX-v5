"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, ChevronLeft, LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLoanStore, SCREENS, type LenderOffer } from "@/store/loanStore";
import { StepProgressBar } from "@/components/loan/shared/StepProgressBar";
import { screenContainer, screenItem, listContainer, listItem } from "@/components/loan/shared/motion";

type FaceStep = "intro" | "capture" | "review" | "verifying";
type FaceCondition =
  | "initializing"
  | "camera_error"
  | "no_face"
  | "off_center"
  | "too_far"
  | "too_close"
  | "low_light"
  | "ready";

type DetectedFace = {
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

type FaceDetectorInstance = {
  detect: (source: CanvasImageSource) => Promise<DetectedFace[]>;
};

const CONDITION_COPY: Record<FaceCondition, string> = {
  initializing: "Starting camera...",
  camera_error: "Camera access is required for selfie verification",
  no_face: "Keep your face inside the circle",
  off_center: "Center your face in the circle",
  too_far: "Move a little closer",
  too_close: "Move slightly away",
  low_light: "Increase lighting on your face",
  ready: "Perfect. Hold still and capture",
};

function SelectedLenderRow({ lenderId, lenders }: { lenderId: string; lenders: LenderOffer[] }) {
  const lender = lenders.find((l) => l.id === lenderId);
  if (!lender) return null;
  return (
    <div className="flex items-center justify-center gap-2 py-2.5">
      <span className="text-xs text-[#78716c]">Proceeding with</span>
      <div
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[6px] font-bold text-white"
        style={{ backgroundColor: lender.color }}
      >
        {lender.logoInitial}
      </div>
      <span className="text-xs font-semibold text-[#1c1917]">{lender.name}</span>
    </div>
  );
}

export function S12_FaceVerification() {
  const { data, update, goTo, back } = useLoanStore();
  const setMerchantStripMode = useLoanStore((s) => s.setMerchantStripMode);
  const [step, setStep] = useState<FaceStep>("intro");
  const [condition, setCondition] = useState<FaceCondition>("initializing");
  const [capturedImage, setCapturedImage] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<FaceDetectorInstance | null>(null);
  const detectingRef = useRef(false);

  useEffect(() => {
    setMerchantStripMode("none");
    return () => setMerchantStripMode(null);
  }, [setMerchantStripMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setCondition("initializing");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const faceApiWindow = window as typeof window & {
        FaceDetector?: new (options?: { maxDetectedFaces?: number; fastMode?: boolean }) => FaceDetectorInstance;
      };

      if (faceApiWindow.FaceDetector) {
        detectorRef.current = new faceApiWindow.FaceDetector({
          maxDetectedFaces: 1,
          fastMode: true,
        });
      } else {
        detectorRef.current = null;
      }

      setCondition("no_face");
    } catch {
      setCondition("camera_error");
    }
  }, []);

  const analyzeFrame = useCallback(async () => {
    if (step !== "capture") return;
    if (detectingRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    detectingRef.current = true;

    try {
      const width = 320;
      const height = 240;
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;

      context.drawImage(video, 0, 0, width, height);

      const imageData = context.getImageData(0, 0, width, height).data;
      let luminanceTotal = 0;
      for (let i = 0; i < imageData.length; i += 16) {
        const r = imageData[i] ?? 0;
        const g = imageData[i + 1] ?? 0;
        const b = imageData[i + 2] ?? 0;
        luminanceTotal += 0.2126 * r + 0.7152 * g + 0.0722 * b;
      }
      const avgLuminance = luminanceTotal / (imageData.length / 16);

      if (detectorRef.current) {
        const faces = await detectorRef.current.detect(canvas);

        if (!faces.length) {
          setCondition(avgLuminance < 52 ? "low_light" : "no_face");
          return;
        }

        const face = faces[0];
        const box = face.boundingBox;

        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;
        const offCenterX = Math.abs(centerX - width / 2) / width;
        const offCenterY = Math.abs(centerY - height / 2) / height;
        const faceAreaRatio = (box.width * box.height) / (width * height);

        if (offCenterX > 0.18 || offCenterY > 0.2) {
          setCondition("off_center");
          return;
        }

        if (faceAreaRatio < 0.12) {
          setCondition("too_far");
          return;
        }

        if (faceAreaRatio > 0.5) {
          setCondition("too_close");
          return;
        }

        if (avgLuminance < 52) {
          setCondition("low_light");
          return;
        }

        setCondition("ready");
        return;
      }

      setCondition(avgLuminance < 52 ? "low_light" : "ready");
    } finally {
      detectingRef.current = false;
    }
  }, [step]);

  useEffect(() => {
    if (step !== "capture") {
      stopCamera();
      return;
    }

    void startCamera();

    const timer = setInterval(() => {
      void analyzeFrame();
    }, 550);

    return () => {
      clearInterval(timer);
      stopCamera();
    };
  }, [analyzeFrame, startCamera, step, stopCamera]);

  useEffect(() => {
    if (step !== "verifying") return;

    const timer = setTimeout(() => {
      update({ faceVerified: true });
      toast.success("Selfie verified successfully");
      goTo(SCREENS.FINAL_OFFERS);
    }, 3000);

    return () => clearTimeout(timer);
  }, [step, update, goTo]);

  const handleCapture = useCallback(() => {
    if (condition !== "ready") return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/jpeg", 0.9);

    setCapturedImage(image);
    setStep("review");
  }, [condition]);

  const handleRetake = useCallback(() => {
    setCapturedImage("");
    setStep("capture");
  }, []);

  const handleConfirmSelfie = useCallback(() => {
    if (!capturedImage) return;
    setStep("verifying");
  }, [capturedImage]);

  if (step === "capture") {
    const canCapture = condition === "ready";

    return (
      <>
        <div className="flex flex-col items-center justify-center gap-3 pt-16 pb-28">
          <div className="relative h-[312px] w-[312px] overflow-hidden rounded-full border-2 border-[#e7e5e4] bg-[#f5f5f4]">
            {condition === "camera_error" ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#78716c]">
                <Camera className="h-8 w-8" />
                <p className="text-sm">Enable camera permission</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover [-webkit-transform:scaleX(-1)] [transform:scaleX(-1)]"
              />
            )}

            <div
              className={`pointer-events-none absolute inset-0 rounded-full border-[3px] ${
                canCapture ? "border-[#10b981]" : "border-white/70"
              }`}
            />
          </div>

          <p className="rounded border border-[#e7e5e4] bg-[#fafaf9] px-3 py-2 text-xs text-[#1c1917]">
            {CONDITION_COPY[condition]}
          </p>

          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 bg-[#fafaf9] px-4 py-4">
          {condition === "camera_error" ? (
            <Button type="button" onClick={() => void startCamera()} className="h-10 w-full text-sm font-semibold">
              Retry camera access
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleCapture}
              disabled={!canCapture}
              className="h-10 w-full text-sm font-semibold"
            >
              Capture
            </Button>
          )}
        </div>
      </>
    );
  }

  if (step === "verifying") {
    return (
      <>
        <div className="flex flex-col items-center justify-center gap-2 pt-16 pb-28">
          <div className="relative h-[312px] w-[312px]">
            {/* Rotating arc border */}
            <motion.div
              className="absolute inset-[-3px] rounded-full"
              style={{
                background: "conic-gradient(from 0deg, #10b981 0deg, #10b981 90deg, transparent 90deg, transparent 360deg)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
            />
            {/* Inner circle clip */}
            <div className="absolute inset-[3px] overflow-hidden rounded-full border border-[#e7e5e4] bg-[#f5f5f4]">
              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured selfie"
                  className="h-full w-full object-cover [-webkit-transform:scaleX(-1)] [transform:scaleX(-1)]"
                />
              ) : (
                <div className="h-full w-full bg-[#f5f5f4]" />
              )}

              {/* Sweeping gradient bar */}
              <motion.div
                className="absolute inset-x-0 h-20 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(16,185,129,0.25), rgba(255,255,255,0.4), rgba(16,185,129,0.25), transparent)",
                }}
                initial={{ top: "-20%" }}
                animate={{ top: ["-20%", "110%", "-20%"] }}
                transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
              />
            </div>

            {/* Corner brackets — NW */}
            <div className="absolute top-4 left-4 h-6 w-6 border-t-2 border-l-2 border-[#10b981] rounded-tl-sm" />
            {/* NE */}
            <div className="absolute top-4 right-4 h-6 w-6 border-t-2 border-r-2 border-[#10b981] rounded-tr-sm" />
            {/* SW */}
            <div className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-[#10b981] rounded-bl-sm" />
            {/* SE */}
            <div className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-[#10b981] rounded-br-sm" />
          </div>

          <div className="rounded border border-[#e7e5e4] bg-[#fafaf9] px-3 py-2 text-xs text-[#1c1917]">
            Verifying your selfie...
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 bg-[#fafaf9] px-4 py-4">
          <Button
            type="button"
            disabled
            className="h-10 w-full bg-[#7e9f95] text-sm font-semibold text-white opacity-100"
          >
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Verifying details
          </Button>
        </div>
      </>
    );
  }

  if (step === "review") {
    return (
      <>
        <div className="flex flex-col items-center justify-center gap-3 pt-16 pb-28">
          <div className="relative h-[312px] w-[312px] overflow-hidden rounded-full bg-[#f5f5f4]">
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured selfie"
                className="h-full w-full object-cover [-webkit-transform:scaleX(-1)] [transform:scaleX(-1)]"
              />
            ) : (
              <div className="h-full w-full bg-[#f5f5f4]" />
            )}
          </div>

          <p className="rounded border border-[#e7e5e4] bg-[#fafaf9] px-3 py-2 text-xs text-[#1c1917]">
            Please ensure good lighting &amp; clear face
          </p>
        </div>

        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 bg-[#fafaf9] px-4 py-4">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleRetake}
              className="h-10 flex-1 border-[#d6d3d1] bg-white text-sm font-semibold text-[#1c1917] hover:bg-[#f5f5f4]"
            >
              Re-take
            </Button>
            <Button type="button" onClick={handleConfirmSelfie} className="h-10 flex-1 text-sm font-semibold">
              Submit
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <motion.div
        className="flex flex-col gap-6 pb-44"
        variants={screenContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={screenItem}>
          <StepProgressBar currentStep={3} />
        </motion.div>

        <motion.div variants={screenItem} className="h-[108px] w-full rounded-lg overflow-hidden"><img src="/illustrations/selfie_verification.svg" alt="" className="h-full w-full object-cover" /></motion.div>

        <motion.div variants={screenItem} className="space-y-1">
          <h2 className="text-[18px] leading-7 font-semibold text-[#1c1917]">Selfie verification</h2>
          <p className="text-sm leading-5 text-[#78716c]">
            Take a clear photo of your face to verify your identity and confirm liveness
          </p>
        </motion.div>

        <motion.div variants={listContainer} className="space-y-1">
          {[
            "Find a good place and lighting",
            "Click a clear picture of the face",
            "Keep your facial expression natural",
          ].map((item) => (
            <motion.div key={item} variants={listItem} className="flex items-center gap-3 rounded-lg px-1 py-2">
              <CheckCircle2 className="h-5 w-5 text-[#10b981]" strokeWidth={2} />
              <p className="text-sm text-[#1c1917]">{item}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[390px] -translate-x-1/2 bg-white border-t border-[#e7e5e4]">
        {data.selectedLenderId && (
          <div className="border-b border-[#f5f5f4]">
            <SelectedLenderRow lenderId={data.selectedLenderId} lenders={data.eligibleLenders} />
          </div>
        )}
        <div className="px-4 pb-4 pt-3">
          <Button
            type="button"
            onClick={() => setStep("capture")}
            className="h-10 w-full text-sm font-semibold"
          >
            Take selfie
          </Button>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-xs text-[#78716c]">100% secure as per RBI</span>
          </div>
        </div>
      </div>
    </>
  );
}
