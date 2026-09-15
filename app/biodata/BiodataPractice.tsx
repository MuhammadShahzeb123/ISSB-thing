"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./biodata.module.css";

const STORAGE_KEY = "issb-prep:biodata-practice:v1";
const MIN_RESPONSE_LENGTH = 20;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const MAX_PHOTO_DIMENSION = 1280;

const fieldDefinitions = [
  {
    key: "personalIntroduction",
    label: "Personal introduction",
    prompt:
      "Introduce yourself through your qualities, formative experiences, and what matters to you.",
    hint: "Avoid official identity numbers, contact details, and exact locations.",
  },
  {
    key: "familySocialBackground",
    label: "Family and social background",
    prompt:
      "Reflect on the values, support, teamwork, or community experiences that have shaped you.",
    hint: "Keep this general; do not include names, addresses, income, religion, caste, or other private identifiers.",
  },
  {
    key: "education",
    label: "Education and learning",
    prompt:
      "Summarise your learning journey, subjects or skills you value, and how you respond to academic challenges.",
    hint: "Institution names, roll numbers, and exact dates are not needed.",
  },
  {
    key: "responsibilitiesActivities",
    label: "Responsibilities and activities",
    prompt:
      "Describe responsibilities, teamwork, volunteering, sports, clubs, projects, or other constructive activities.",
    hint: "Focus on your role, actions, and learning rather than identifying other people.",
  },
  {
    key: "interests",
    label: "Interests",
    prompt:
      "Note the interests you pursue consistently and what they have taught you.",
    hint: "Use specific examples without adding sensitive personal details.",
  },
  {
    key: "achievementsSetbacks",
    label: "Achievements and setbacks",
    prompt:
      "Describe one meaningful achievement and one setback, including your contribution and what changed afterward.",
    hint: "A balanced, factual reflection is more useful than a list of claims.",
  },
  {
    key: "currentAffairs",
    label: "Current affairs awareness",
    prompt:
      "Choose a current issue, summarise what you understand, and note the sources or perspectives you would compare.",
    hint: "Separate facts, source quality, and your own developing view.",
  },
  {
    key: "goals",
    label: "Goals",
    prompt:
      "Outline near-term and longer-term goals, why they matter, and practical steps you can take.",
    hint: "This is personal planning, not a prediction of selection outcomes.",
  },
  {
    key: "selfReflection",
    label: "Self-reflection",
    prompt:
      "Identify strengths you can demonstrate, areas you are improving, and feedback you have acted on.",
    hint: "Do not include medical or other sensitive health information.",
  },
] as const;

type FieldKey = (typeof fieldDefinitions)[number]["key"];
type BiodataFields = Record<FieldKey, string>;
type FieldErrors = Partial<Record<FieldKey, string>>;
type FacingMode = "user" | "environment";
type PhotoSource = "camera" | "file";

interface SavedDraft {
  version: 1;
  savedAt: string;
  fields: BiodataFields;
  photoDataUrl: string | null;
  photoSource: PhotoSource | null;
}

const emptyFields = Object.fromEntries(
  fieldDefinitions.map(({ key }) => [key, ""]),
) as BiodataFields;

function isBiodataFields(value: unknown): value is BiodataFields {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return fieldDefinitions.every(({ key }) => typeof record[key] === "string");
}

function isSavedDraft(value: unknown): value is SavedDraft {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const photoDataUrl = record.photoDataUrl;
  const photoSource = record.photoSource;

  return (
    record.version === 1 &&
    typeof record.savedAt === "string" &&
    isBiodataFields(record.fields) &&
    (photoDataUrl === null || typeof photoDataUrl === "string") &&
    (photoSource === null ||
      photoSource === "camera" ||
      photoSource === "file")
  );
}

function validateFields(fields: BiodataFields): FieldErrors {
  const errors: FieldErrors = {};

  for (const field of fieldDefinitions) {
    const response = fields[field.key].trim();
    if (!response) {
      errors[field.key] = "Add a response before opening the review.";
    } else if (response.length < MIN_RESPONSE_LENGTH) {
      errors[field.key] =
        `Add a little more detail (${MIN_RESPONSE_LENGTH} characters minimum).`;
    }
  }

  return errors;
}

function cameraErrorMessage(error: unknown): string {
  if (!(error instanceof DOMException)) {
    return "The camera could not be started. You can use the picture upload option instead.";
  }

  if (error.name === "NotAllowedError" || error.name === "SecurityError") {
    return "Camera permission was denied. Allow access in your browser settings or use picture upload.";
  }
  if (error.name === "NotFoundError" || error.name === "OverconstrainedError") {
    return "No suitable camera was found. You can use picture upload instead.";
  }
  if (error.name === "NotReadableError" || error.name === "AbortError") {
    return "The camera is unavailable or already in use by another app.";
  }

  return "The camera could not be started. You can use the picture upload option instead.";
}

export default function BiodataPractice() {
  const [fields, setFields] = useState<BiodataFields>({ ...emptyFields });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [view, setView] = useState<"edit" | "review">("edit");
  const [statusMessage, setStatusMessage] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoSource, setPhotoSource] = useState<PhotoSource | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [facingMode, setFacingMode] = useState<FacingMode>("user");
  const [cameraSwitchAvailable, setCameraSwitchAvailable] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);
  const cameraRequestGenerationRef = useRef(0);
  const uploadGenerationRef = useRef(0);

  const completedCount = useMemo(
    () =>
      fieldDefinitions.filter(({ key }) => fields[key].trim().length > 0)
        .length,
    [fields],
  );

  const stopCamera = useCallback(() => {
    cameraRequestGenerationRef.current += 1;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (mountedRef.current) {
      setCameraStream(null);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const storedDraft = window.localStorage.getItem(STORAGE_KEY);
        if (!storedDraft) {
          return;
        }

        const parsed: unknown = JSON.parse(storedDraft);
        if (isSavedDraft(parsed)) {
          setSavedAt(parsed.savedAt);
        }
      } catch {
        setStatusMessage(
          "A saved draft was found but its summary could not be read.",
        );
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!cameraStream || !videoRef.current) {
      return;
    }

    videoRef.current.srcObject = cameraStream;
    void videoRef.current.play().catch(() => {
      setCameraError("The camera preview could not start in this browser.");
    });
  }, [cameraStream]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      cameraRequestGenerationRef.current += 1;
      uploadGenerationRef.current += 1;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  const startCamera = useCallback(
    async (requestedFacingMode: FacingMode = facingMode) => {
      uploadGenerationRef.current += 1;
      setCameraError("");
      setStatusMessage("");

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(
          "Camera access is not supported in this browser. Use picture upload instead.",
        );
        return;
      }

      stopCamera();
      const requestGeneration = cameraRequestGenerationRef.current;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: requestedFacingMode },
          },
        });

        if (
          !mountedRef.current ||
          cameraRequestGenerationRef.current !== requestGeneration
        ) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = stream;
        setCameraStream(stream);
        setFacingMode(requestedFacingMode);

        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          if (
            mountedRef.current &&
            cameraRequestGenerationRef.current === requestGeneration
          ) {
            setCameraSwitchAvailable(
              devices.filter((device) => device.kind === "videoinput").length >
                1,
            );
          }
        } catch {
          if (
            mountedRef.current &&
            cameraRequestGenerationRef.current === requestGeneration
          ) {
            setCameraSwitchAvailable(false);
          }
        }
      } catch (error) {
        if (
          mountedRef.current &&
          cameraRequestGenerationRef.current === requestGeneration
        ) {
          setCameraError(cameraErrorMessage(error));
        }
      }
    },
    [facingMode, stopCamera],
  );

  const switchCamera = async () => {
    const nextFacingMode: FacingMode =
      facingMode === "user" ? "environment" : "user";
    await startCamera(nextFacingMode);
  };

  const capturePhoto = () => {
    uploadGenerationRef.current += 1;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
      setCameraError("Wait for the preview to become ready, then try again.");
      return;
    }

    const scale = Math.min(
      1,
      MAX_PHOTO_DIMENSION / Math.max(video.videoWidth, video.videoHeight),
    );
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) {
      setCameraError("This browser could not prepare the captured picture.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhotoDataUrl(canvas.toDataURL("image/jpeg", 0.82));
    setPhotoSource("camera");
    setStatusMessage(
      "Picture captured in memory. Use “Save to this browser” to keep it after leaving.",
    );
    stopCamera();
  };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadGeneration = uploadGenerationRef.current + 1;
    uploadGenerationRef.current = uploadGeneration;
    const file = event.target.files?.[0];
    event.target.value = "";
    setCameraError("");

    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      setCameraError("Choose an image file.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setCameraError("Choose an image smaller than 5 MB.");
      return;
    }

    stopCamera();

    const reader = new FileReader();
    reader.onload = () => {
      if (
        !mountedRef.current ||
        uploadGenerationRef.current !== uploadGeneration
      ) {
        return;
      }
      if (typeof reader.result !== "string") {
        setCameraError("The selected image could not be read.");
        return;
      }

      const image = new Image();
      image.onload = () => {
        if (
          !mountedRef.current ||
          uploadGenerationRef.current !== uploadGeneration
        ) {
          return;
        }
        const scale = Math.min(
          1,
          MAX_PHOTO_DIMENSION /
            Math.max(image.naturalWidth, image.naturalHeight),
        );
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.naturalWidth * scale);
        canvas.height = Math.round(image.naturalHeight * scale);
        const context = canvas.getContext("2d");
        if (!context) {
          setCameraError("The selected image could not be prepared.");
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        setPhotoDataUrl(canvas.toDataURL("image/jpeg", 0.82));
        setPhotoSource("file");
        setStatusMessage(
          "Picture added in memory. Use “Save to this browser” to keep it after leaving.",
        );
        stopCamera();
      };
      image.onerror = () => {
        if (
          mountedRef.current &&
          uploadGenerationRef.current === uploadGeneration
        ) {
          setCameraError("The selected image could not be prepared.");
        }
      };
      image.src = reader.result;
    };
    reader.onerror = () => {
      if (
        mountedRef.current &&
        uploadGenerationRef.current === uploadGeneration
      ) {
        setCameraError("The selected image could not be read.");
      }
    };
    reader.readAsDataURL(file);
  };

  const updateField = (key: FieldKey, value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setStatusMessage("");
  };

  const openReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateFields(fields);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatusMessage(
        "Review the highlighted sections before opening the summary.",
      );
      window.setTimeout(() => {
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus();
      }, 0);
      return;
    }

    setView("review");
    setStatusMessage("Review summary opened.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveToBrowser = () => {
    const draft: SavedDraft = {
      version: 1,
      savedAt: new Date().toISOString(),
      fields,
      photoDataUrl,
      photoSource,
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setSavedAt(draft.savedAt);
      setStatusMessage(
        "Draft saved only in this browser. It is not encrypted or uploaded.",
      );
    } catch {
      setStatusMessage(
        "The browser could not save this draft. Storage may be full or unavailable.",
      );
    }
  };

  const loadSavedDraft = () => {
    uploadGenerationRef.current += 1;
    stopCamera();

    try {
      const storedDraft = window.localStorage.getItem(STORAGE_KEY);
      if (!storedDraft) {
        setSavedAt(null);
        setStatusMessage("No saved browser draft was found.");
        return;
      }

      const parsed: unknown = JSON.parse(storedDraft);
      if (!isSavedDraft(parsed)) {
        throw new Error("Invalid saved draft");
      }

      setFields(parsed.fields);
      setPhotoDataUrl(parsed.photoDataUrl);
      setPhotoSource(parsed.photoSource);
      setSavedAt(parsed.savedAt);
      setErrors({});
      setView("edit");
      setStatusMessage("Saved browser draft loaded into memory.");
    } catch {
      setStatusMessage("The saved browser draft could not be loaded.");
    }
  };

  const deleteSavedDraft = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setSavedAt(null);
      setStatusMessage(
        "Saved browser draft deleted. Your current in-memory work is unchanged.",
      );
    } catch {
      setStatusMessage("The saved browser draft could not be deleted.");
    }
  };

  const exportJson = () => {
    const exportPayload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      notice:
        "Unofficial personal practice data. Store this file securely; it may contain personal reflections and an optional picture.",
      fields,
      photo:
        photoDataUrl && photoSource
          ? { dataUrl: photoDataUrl, source: photoSource }
          : null,
    };
    const file = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `biodata-practice-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setStatusMessage("A local JSON copy was downloaded.");
  };

  const clearAll = () => {
    const shouldClear = window.confirm(
      "Clear every response and the current picture from memory? This does not delete a separately saved browser draft.",
    );
    if (!shouldClear) {
      return;
    }

    uploadGenerationRef.current += 1;
    stopCamera();
    setFields({ ...emptyFields });
    setPhotoDataUrl(null);
    setPhotoSource(null);
    setErrors({});
    setView("edit");
    setCameraError("");
    setStatusMessage(
      "In-memory responses and picture cleared. Any saved browser draft is unchanged.",
    );
  };

  const removePhoto = () => {
    uploadGenerationRef.current += 1;
    setPhotoDataUrl(null);
    setPhotoSource(null);
    setStatusMessage(
      "Picture removed from memory. Save again to update a saved browser draft.",
    );
  };

  const retakePhoto = () => {
    uploadGenerationRef.current += 1;
    setPhotoDataUrl(null);
    setPhotoSource(null);
    void startCamera();
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Private, unofficial practice organizer</p>
        <h1>Biodata reflection practice</h1>
        <p className={styles.heroText}>
          Organise broad themes for personal reflection and interview practice.
          This is not an official ISSB form and does not predict or affect
          selection.
        </p>
        <div className={styles.privacyBanner} role="note">
          <strong>Your privacy:</strong> responses stay in memory unless you
          explicitly save or export them. Browser-saved data stays on this
          device, is not encrypted, and is never required for selection. This
          page does not upload responses or pictures.
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.workspace} aria-labelledby="workspace-title">
          <div className={styles.workspaceHeader}>
            <div>
              <p className={styles.sectionTag}>Your workspace</p>
              <h2 id="workspace-title">
                {view === "edit" ? "Build your practice notes" : "Review summary"}
              </h2>
              <p>
                {completedCount} of {fieldDefinitions.length} reflection
                sections started
              </p>
            </div>
            <div className={styles.viewSwitch} aria-label="Workspace view">
              <button
                type="button"
                className={view === "edit" ? styles.activeView : ""}
                onClick={() => setView("edit")}
                aria-pressed={view === "edit"}
              >
                Edit
              </button>
              <button
                type="button"
                className={view === "review" ? styles.activeView : ""}
                onClick={() => {
                  const nextErrors = validateFields(fields);
                  if (Object.keys(nextErrors).length > 0) {
                    setErrors(nextErrors);
                    setView("edit");
                    setStatusMessage(
                      "Complete the highlighted sections before opening review.",
                    );
                    return;
                  }
                  setView("review");
                }}
                aria-pressed={view === "review"}
              >
                Review
              </button>
            </div>
          </div>

          <p className={styles.status} role="status" aria-live="polite">
            {statusMessage}
          </p>

          {view === "edit" ? (
            <form ref={formRef} onSubmit={openReview} noValidate>
              <div className={styles.formGrid}>
                {fieldDefinitions.map((field, index) => {
                  const error = errors[field.key];
                  const inputId = `biodata-${field.key}`;
                  const hintId = `${inputId}-hint`;
                  const errorId = `${inputId}-error`;

                  return (
                    <div className={styles.fieldCard} key={field.key}>
                      <div className={styles.fieldNumber} aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <label htmlFor={inputId}>{field.label}</label>
                      <p className={styles.prompt}>{field.prompt}</p>
                      <textarea
                        id={inputId}
                        value={fields[field.key]}
                        onChange={(event) =>
                          updateField(field.key, event.target.value)
                        }
                        rows={6}
                        required
                        aria-invalid={Boolean(error)}
                        aria-describedby={`${hintId}${error ? ` ${errorId}` : ""}`}
                      />
                      <div className={styles.fieldMeta}>
                        <span id={hintId}>{field.hint}</span>
                        <span aria-label={`${fields[field.key].length} characters`}>
                          {fields[field.key].length}
                        </span>
                      </div>
                      {error ? (
                        <p className={styles.error} id={errorId}>
                          {error}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <PhotoPanel
                cameraError={cameraError}
                cameraStream={cameraStream}
                cameraSwitchAvailable={cameraSwitchAvailable}
                facingMode={facingMode}
                photoDataUrl={photoDataUrl}
                videoRef={videoRef}
                canvasRef={canvasRef}
                onCapture={capturePhoto}
                onRemove={removePhoto}
                onRetake={retakePhoto}
                onStart={() => void startCamera()}
                onStop={stopCamera}
                onSwitch={() => void switchCamera()}
                onUpload={handlePhotoUpload}
              />

              <div className={styles.primaryActions}>
                <button className={styles.primaryButton} type="submit">
                  Review responses
                </button>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={saveToBrowser}
                >
                  Save to this browser
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.review}>
              {photoDataUrl ? (
                <div className={styles.reviewPhoto}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoDataUrl}
                    alt="Optional practice profile preview"
                  />
                  <p>Optional local picture</p>
                </div>
              ) : null}
              <dl>
                {fieldDefinitions.map((field) => (
                  <div className={styles.reviewItem} key={field.key}>
                    <dt>{field.label}</dt>
                    <dd>{fields[field.key]}</dd>
                  </div>
                ))}
              </dl>
              <div className={styles.primaryActions}>
                <button
                  className={styles.primaryButton}
                  type="button"
                  onClick={() => setView("edit")}
                >
                  Return to edit
                </button>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={saveToBrowser}
                >
                  Save to this browser
                </button>
              </div>
            </div>
          )}
        </section>

        <aside className={styles.controls} aria-labelledby="local-tools-title">
          <p className={styles.sectionTag}>Local controls</p>
          <h2 id="local-tools-title">Keep control of your data</h2>
          <p>
            Nothing is saved automatically. Saving uses this browser&apos;s
            local storage; exporting downloads a JSON file to your device.
          </p>

          <div className={styles.controlStack}>
            <button type="button" onClick={saveToBrowser}>
              Save to this browser
            </button>
            <button type="button" onClick={exportJson}>
              Export current data as JSON
            </button>
            <button type="button" onClick={loadSavedDraft} disabled={!savedAt}>
              Load saved draft
            </button>
            <button
              type="button"
              onClick={deleteSavedDraft}
              disabled={!savedAt}
            >
              Delete saved draft
            </button>
            <button
              className={styles.dangerButton}
              type="button"
              onClick={clearAll}
            >
              Clear all in-memory data
            </button>
          </div>

          <p className={styles.savedState}>
            {savedAt
              ? `Saved locally ${new Date(savedAt).toLocaleString()}.`
              : "No saved browser draft detected."}
          </p>
          <p className={styles.storageWarning}>
            Other people using this browser profile may be able to read saved
            data. Use delete and clear controls when practising on a shared
            device.
          </p>
        </aside>

        <section className={styles.methodology} aria-labelledby="method-title">
          <p className={styles.sectionTag}>Methodology and source limits</p>
          <h2 id="method-title">What these prompts are based on</h2>
          <p>
            The organizer uses general, publicly defensible reflection themes:
            introduction, background, education, responsibilities, interests,
            experiences, awareness, goals, and self-review. They are neutral
            practice prompts, not claimed official fields, scoring criteria, or
            selection requirements.
          </p>
          <p>
            For current procedures and required documents, rely on instructions
            from official ISSB and relevant service recruitment channels. Do
            not use this page as a substitute for those sources.
          </p>
        </section>
      </main>
    </div>
  );
}

interface PhotoPanelProps {
  cameraError: string;
  cameraStream: MediaStream | null;
  cameraSwitchAvailable: boolean;
  facingMode: FacingMode;
  photoDataUrl: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onCapture: () => void;
  onRemove: () => void;
  onRetake: () => void;
  onStart: () => void;
  onStop: () => void;
  onSwitch: () => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

function PhotoPanel({
  cameraError,
  cameraStream,
  cameraSwitchAvailable,
  facingMode,
  photoDataUrl,
  videoRef,
  canvasRef,
  onCapture,
  onRemove,
  onRetake,
  onStart,
  onStop,
  onSwitch,
  onUpload,
}: PhotoPanelProps) {
  return (
    <section className={styles.photoPanel} aria-labelledby="photo-title">
      <div>
        <p className={styles.sectionTag}>Optional local picture</p>
        <h2 id="photo-title">Add a practice profile picture</h2>
        <p>
          Start the camera only when ready, or choose a picture file. The image
          remains in memory until you explicitly save it to this browser.
        </p>
      </div>

      <div className={styles.photoStage}>
        {photoDataUrl ? (
          <div className={styles.photoPreview}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoDataUrl} alt="Current optional practice profile" />
          </div>
        ) : (
          <div
            className={`${styles.cameraPreview} ${
              cameraStream ? styles.cameraPreviewActive : ""
            }`}
          >
            <video
              ref={videoRef}
              muted
              playsInline
              aria-label={`Live ${
                facingMode === "user" ? "front" : "rear"
              } camera preview`}
            />
            {!cameraStream ? (
              <p>No camera is active. Permission is requested only after Start camera.</p>
            ) : null}
          </div>
        )}
        <canvas ref={canvasRef} className={styles.hiddenCanvas} />
      </div>

      {cameraError ? (
        <p className={styles.cameraError} role="alert">
          {cameraError}
        </p>
      ) : null}

      <div className={styles.photoActions}>
        {!cameraStream && !photoDataUrl ? (
          <button type="button" onClick={onStart}>
            Start camera
          </button>
        ) : null}
        {cameraStream ? (
          <>
            <button type="button" onClick={onCapture}>
              Capture picture
            </button>
            {cameraSwitchAvailable ? (
              <button type="button" onClick={onSwitch}>
                Switch to {facingMode === "user" ? "rear" : "front"} camera
              </button>
            ) : null}
            <button type="button" onClick={onStop}>
              Stop camera
            </button>
          </>
        ) : null}
        {photoDataUrl ? (
          <>
            <button type="button" onClick={onRetake}>
              Retake with camera
            </button>
            <button type="button" onClick={onRemove}>
              Remove picture
            </button>
          </>
        ) : null}
        <label className={styles.uploadButton}>
          Choose picture file
          <input type="file" accept="image/*" onChange={onUpload} />
        </label>
      </div>
      <p className={styles.photoNote}>
        Upload fallback accepts image files up to 5 MB. Pictures are never sent
        to a server by this module.
      </p>
    </section>
  );
}
