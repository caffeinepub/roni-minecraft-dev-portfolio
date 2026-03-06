import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  Globe,
  Image,
  Link,
  Loader2,
  MessageSquare,
  Monitor,
  Plus,
  Radio,
  RefreshCw,
  Server,
  Trash2,
  Upload,
  UserCircle,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ContactMessage, GalleryImage } from "../../backend.d";
import { useActor } from "../../hooks/useActor";

/* ─── Types ──────────────────────────────────────────────────── */
type Tab = "transmissions" | "gallery" | "website-showcase" | "about";
type GalleryFormMode = "add" | "edit";
type InputMode = "url" | "upload";

interface GalleryFormState {
  mode: GalleryFormMode;
  id?: bigint;
  url: string;
  caption: string;
  saving: boolean;
  error: string;
}

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
}

/* ─── Helpers ────────────────────────────────────────────────── */
function formatTimestamp(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  const d = new Date(ms);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ─── Sub-components ─────────────────────────────────────────── */
function TransmissionsTab({
  actor,
}: { actor: ReturnType<typeof useActor>["actor"] }) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMessages = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    setError("");
    try {
      const msgs = await actor.getAllMessages();
      // newest first
      const sorted = [...msgs].sort((a, b) =>
        Number(b.timestamp - a.timestamp),
      );
      setMessages(sorted);
      setError("");
    } catch (err) {
      console.error("Failed to load transmissions:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Failed to load transmissions. ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Show spinner while either loading or waiting for actor
  if (loading || !actor) {
    return (
      <div
        data-ocid="admin.transmissions.loading_state"
        className="flex flex-col items-center justify-center py-20 gap-4"
      >
        <Loader2
          size={28}
          className="animate-spin"
          style={{ color: "oklch(var(--glow))" }}
        />
        <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
          Scanning transmissions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        data-ocid="admin.transmissions.error_state"
        className="flex flex-col items-center justify-center py-20 gap-4"
      >
        <AlertCircle size={28} className="text-destructive" />
        <p className="text-sm text-destructive text-center max-w-sm">{error}</p>
        <button
          type="button"
          data-ocid="admin.transmissions.button"
          onClick={fetchMessages}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          style={{
            background: "oklch(0.55 0.28 290 / 0.15)",
            border: "1px solid oklch(0.55 0.28 290 / 0.4)",
            color: "oklch(var(--glow))",
          }}
        >
          <RefreshCw size={13} />
          Retry
        </button>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div
        data-ocid="admin.transmissions.empty_state"
        className="flex flex-col items-center justify-center py-20 gap-4"
      >
        <Radio size={32} style={{ color: "oklch(var(--primary) / 0.4)" }} />
        <p className="text-sm font-mono tracking-widest uppercase text-muted-foreground">
          No transmissions received
        </p>
      </div>
    );
  }

  return (
    <div data-ocid="admin.transmissions.list" className="flex flex-col gap-3">
      {messages.map((msg, i) => (
        <motion.div
          key={`${msg.name}-${msg.timestamp.toString()}`}
          data-ocid={`admin.transmissions.item.${i + 1}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.04 }}
          className="rounded-xl p-5 relative overflow-hidden"
          style={{
            background: "oklch(0.10 0.04 280 / 0.7)",
            border: "1px solid oklch(var(--border) / 0.6)",
            boxShadow: "0 4px 20px oklch(0 0 0 / 0.4)",
          }}
        >
          {/* Top glow line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, oklch(0.55 0.28 290 / 0.5) 50%, transparent 100%)",
            }}
          />

          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0"
                style={{
                  background: "oklch(0.55 0.28 290 / 0.15)",
                  border: "1px solid oklch(0.55 0.28 290 / 0.4)",
                  color: "oklch(var(--glow))",
                }}
              >
                {msg.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground leading-none">
                  {msg.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {msg.email}
                </p>
              </div>
            </div>
            <p
              className="text-xs font-mono shrink-0"
              style={{ color: "oklch(var(--primary) / 0.6)" }}
            >
              {formatTimestamp(msg.timestamp as bigint)}
            </p>
          </div>

          <div
            className="rounded-lg p-3 text-sm text-muted-foreground leading-relaxed"
            style={{
              background: "oklch(0.07 0.02 280 / 0.6)",
              border: "1px solid oklch(var(--border) / 0.3)",
            }}
          >
            {msg.message}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function GalleryTab({
  actor,
}: { actor: ReturnType<typeof useActor>["actor"] }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<GalleryFormState | null>(null);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<bigint | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("url");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string>("");
  const urlInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    setError("");
    try {
      const imgs = await actor.getAllImages();
      const sorted = [...imgs].sort((a, b) => Number(a.order - b.order));
      setImages(sorted);
      setError("");
    } catch (err) {
      console.error("Failed to load gallery images:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Failed to load gallery images. ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Focus URL input when form opens
  useEffect(() => {
    if (form) {
      setTimeout(() => urlInputRef.current?.focus(), 50);
    }
  }, [form]);

  const openAdd = () => {
    setInputMode("url");
    setUploadPreview("");
    setForm({ mode: "add", url: "", caption: "", saving: false, error: "" });
  };

  const openEdit = (img: GalleryImage) => {
    // If existing URL looks like a data URL, default to upload tab
    const isDataUrl = img.url.startsWith("data:");
    setInputMode(isDataUrl ? "upload" : "url");
    setUploadPreview(isDataUrl ? img.url : "");
    setForm({
      mode: "edit",
      id: img.id,
      url: img.url,
      caption: img.caption,
      saving: false,
      error: "",
    });
  };

  const closeForm = () => {
    setForm(null);
    setUploadPreview("");
  };

  const handleFileLoad = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setForm((f) =>
        f ? { ...f, error: "Only image files are accepted." } : null,
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadPreview(dataUrl);
      setForm((f) => f && { ...f, url: dataUrl, error: "" });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileLoad(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileLoad(file);
    // reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!form || !actor) return;
    const { url, caption } = form;
    if (!url.trim()) {
      setForm(
        (f) =>
          f && {
            ...f,
            error:
              inputMode === "upload"
                ? "Please select an image file."
                : "URL is required.",
          },
      );
      return;
    }
    setForm((f) => f && { ...f, saving: true, error: "" });

    try {
      if (form.mode === "add") {
        await actor.addImage(url.trim(), caption.trim());
      } else if (form.mode === "edit" && form.id !== undefined) {
        await actor.editImage(form.id, url.trim(), caption.trim());
      }
      setForm(null);
      setLoading(true);
      await fetchImages();
    } catch {
      setForm((f) =>
        f
          ? { ...f, saving: false, error: "Save failed. Please try again." }
          : null,
      );
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!actor) return;
    setConfirmDeleteId(null);
    setDeletingId(id);
    try {
      await actor.removeImage(id);
      await fetchImages();
    } catch {
      // silently ignore on failure, still refresh
      await fetchImages();
    } finally {
      setDeletingId(null);
    }
  };

  const inputClass =
    "w-full rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-all duration-200 font-body";
  const inputStyle: React.CSSProperties = {
    background: "oklch(0.09 0.03 280 / 0.85)",
    border: "1px solid oklch(0.28 0.08 285 / 0.7)",
    backdropFilter: "blur(12px)",
  };

  if (loading || !actor) {
    return (
      <div
        data-ocid="admin.gallery.loading_state"
        className="flex flex-col items-center justify-center py-20 gap-4"
      >
        <Loader2
          size={28}
          className="animate-spin"
          style={{ color: "oklch(var(--glow))" }}
        />
        <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
          Loading gallery...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        data-ocid="admin.gallery.error_state"
        className="flex flex-col items-center justify-center py-20 gap-4"
      >
        <AlertCircle size={28} className="text-destructive" />
        <p className="text-sm text-destructive text-center max-w-sm">{error}</p>
        <button
          type="button"
          data-ocid="admin.gallery.button"
          onClick={fetchImages}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          style={{
            background: "oklch(0.55 0.28 290 / 0.15)",
            border: "1px solid oklch(0.55 0.28 290 / 0.4)",
            color: "oklch(var(--glow))",
          }}
        >
          <RefreshCw size={13} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Add button */}
      <div className="flex justify-end">
        <button
          type="button"
          data-ocid="admin.gallery.add_button"
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.38 0.32 292) 0%, oklch(0.52 0.30 288) 100%)",
            boxShadow:
              "0 0 20px oklch(0.55 0.28 290 / 0.4), 0 0 40px oklch(0.55 0.28 290 / 0.15)",
            color: "oklch(0.98 0.005 280)",
          }}
        >
          <Plus size={15} />
          Add Image
        </button>
      </div>

      {/* Inline add/edit form */}
      <AnimatePresence>
        {form && (
          <motion.div
            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
            animate={{ opacity: 1, height: "auto", overflow: "visible" }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            transition={{ duration: 0.25 }}
            className="rounded-xl p-5 relative"
            style={{
              background: "oklch(0.12 0.05 285 / 0.8)",
              border: "1px solid oklch(0.55 0.28 290 / 0.4)",
              boxShadow: "0 0 30px oklch(0.55 0.28 290 / 0.1)",
            }}
          >
            <p
              className="text-xs font-mono tracking-widest uppercase mb-4"
              style={{ color: "oklch(var(--glow))" }}
            >
              {form.mode === "add" ? "// NEW IMAGE" : "// EDIT IMAGE"}
            </p>

            <div className="flex flex-col gap-3">
              {/* Mode toggle: URL vs Upload */}
              <div
                className="flex gap-1 p-1 rounded-xl"
                style={{
                  background: "oklch(0.07 0.02 280 / 0.8)",
                  border: "1px solid oklch(var(--border) / 0.4)",
                }}
              >
                <button
                  type="button"
                  data-ocid="admin.gallery.url.tab"
                  onClick={() => {
                    setInputMode("url");
                    setForm((f) => f && { ...f, error: "" });
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  style={
                    inputMode === "url"
                      ? {
                          background:
                            "linear-gradient(135deg, oklch(0.38 0.32 292 / 0.5) 0%, oklch(0.52 0.30 288 / 0.35) 100%)",
                          border: "1px solid oklch(0.55 0.28 290 / 0.5)",
                          color: "oklch(var(--glow))",
                          boxShadow: "0 0 12px oklch(0.55 0.28 290 / 0.12)",
                        }
                      : { color: "oklch(var(--muted-foreground))" }
                  }
                >
                  <Link size={11} />
                  URL
                </button>
                <button
                  type="button"
                  data-ocid="admin.gallery.upload.tab"
                  onClick={() => {
                    setInputMode("upload");
                    setForm((f) => f && { ...f, error: "" });
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  style={
                    inputMode === "upload"
                      ? {
                          background:
                            "linear-gradient(135deg, oklch(0.38 0.32 292 / 0.5) 0%, oklch(0.52 0.30 288 / 0.35) 100%)",
                          border: "1px solid oklch(0.55 0.28 290 / 0.5)",
                          color: "oklch(var(--glow))",
                          boxShadow: "0 0 12px oklch(0.55 0.28 290 / 0.12)",
                        }
                      : { color: "oklch(var(--muted-foreground))" }
                  }
                >
                  <Upload size={11} />
                  Upload
                </button>
              </div>

              {/* URL input */}
              {inputMode === "url" && (
                <div>
                  <label
                    htmlFor="admin-img-url"
                    className="block text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground mb-1.5"
                  >
                    Image URL
                  </label>
                  <input
                    id="admin-img-url"
                    ref={urlInputRef}
                    data-ocid="admin.gallery.url.input"
                    type="url"
                    value={form.url}
                    onChange={(e) =>
                      setForm((f) => f && { ...f, url: e.target.value })
                    }
                    placeholder="https://..."
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              )}

              {/* Upload dropzone */}
              {inputMode === "upload" && (
                <div>
                  <label
                    htmlFor="admin-img-file"
                    className="block text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground mb-1.5"
                  >
                    Device Image
                  </label>

                  {/* Hidden file input */}
                  <input
                    id="admin-img-file"
                    ref={fileInputRef}
                    data-ocid="admin.gallery.upload_button"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileInputChange}
                    tabIndex={-1}
                  />

                  {/* Dropzone — label wraps hidden input for click-to-browse; drag events on the label itself */}
                  <label
                    htmlFor="admin-img-file"
                    data-ocid="admin.gallery.dropzone"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="relative flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-200 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 select-none"
                    style={{
                      minHeight: uploadPreview ? "0" : "130px",
                      background: isDragOver
                        ? "oklch(0.12 0.06 285 / 0.9)"
                        : "oklch(0.09 0.03 280 / 0.85)",
                      border: isDragOver
                        ? "1.5px solid oklch(0.55 0.28 290 / 0.8)"
                        : "1.5px dashed oklch(0.28 0.08 285 / 0.6)",
                      backdropFilter: "blur(12px)",
                      boxShadow: isDragOver
                        ? "0 0 20px oklch(0.55 0.28 290 / 0.25), inset 0 0 20px oklch(0.55 0.28 290 / 0.07)"
                        : "none",
                    }}
                  >
                    {/* Drag-over overlay glow */}
                    {isDragOver && (
                      <div
                        className="absolute inset-0 pointer-events-none rounded-xl"
                        style={{
                          background:
                            "radial-gradient(ellipse at center, oklch(0.55 0.28 290 / 0.1) 0%, transparent 70%)",
                        }}
                      />
                    )}

                    {uploadPreview ? (
                      /* Preview with overlay replace hint */
                      <div className="relative w-full group">
                        <img
                          src={uploadPreview}
                          alt="Selected preview"
                          className="w-full max-h-48 object-contain rounded-xl"
                          style={{ display: "block" }}
                        />
                        <div
                          className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{
                            background: "oklch(0.06 0.03 280 / 0.75)",
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          <Upload
                            size={20}
                            style={{ color: "oklch(var(--glow))" }}
                          />
                          <span className="text-[10px] font-mono tracking-widest uppercase text-foreground">
                            Replace image
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Empty dropzone prompt */
                      <div className="flex flex-col items-center justify-center gap-3 py-8 px-6 pointer-events-none">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{
                            background: "oklch(0.55 0.28 290 / 0.12)",
                            border: "1px solid oklch(0.55 0.28 290 / 0.3)",
                          }}
                        >
                          <Upload
                            size={18}
                            style={{
                              color: isDragOver
                                ? "oklch(0.85 0.18 290)"
                                : "oklch(var(--glow))",
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <p
                            className="text-xs font-mono tracking-widest uppercase mb-1"
                            style={{
                              color: isDragOver
                                ? "oklch(0.85 0.18 290)"
                                : "oklch(var(--glow) / 0.8)",
                            }}
                          >
                            {isDragOver ? "Drop to upload" : "Drop image here"}
                          </p>
                          <p className="text-[10px] font-mono tracking-wider text-muted-foreground/60">
                            or click to browse files
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              )}

              <div>
                <label
                  htmlFor="admin-img-caption"
                  className="block text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground mb-1.5"
                >
                  Caption
                </label>
                <input
                  id="admin-img-caption"
                  data-ocid="admin.gallery.caption.input"
                  type="text"
                  value={form.caption}
                  onChange={(e) =>
                    setForm((f) => f && { ...f, caption: e.target.value })
                  }
                  placeholder="Spawn Build, PvP Arena, etc."
                  className={inputClass}
                  style={inputStyle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                  }}
                />
              </div>

              {form.error && (
                <p className="text-xs text-destructive flex items-center gap-1.5">
                  <AlertCircle size={12} />
                  {form.error}
                </p>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  data-ocid="admin.gallery.save_button"
                  onClick={handleSave}
                  disabled={form.saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  style={{
                    background: "oklch(0.55 0.28 290 / 0.2)",
                    border: "1px solid oklch(0.55 0.28 290 / 0.5)",
                    color: "oklch(var(--glow))",
                  }}
                >
                  {form.saving ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={13} />
                  )}
                  {form.saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  data-ocid="admin.gallery.cancel_button"
                  onClick={closeForm}
                  disabled={form.saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border/50"
                  style={{
                    background: "oklch(0.12 0.03 280 / 0.5)",
                    border: "1px solid oklch(var(--border) / 0.4)",
                  }}
                >
                  <X size={13} />
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery list */}
      {images.length === 0 ? (
        <div
          data-ocid="admin.gallery.empty_state"
          className="flex flex-col items-center justify-center py-12 gap-4"
        >
          <Image size={32} style={{ color: "oklch(var(--primary) / 0.4)" }} />
          <p className="text-sm font-mono tracking-widest uppercase text-muted-foreground">
            No custom images added
          </p>
          <div
            className="rounded-xl px-5 py-3.5 text-center max-w-xs"
            style={{
              background: "oklch(0.55 0.28 290 / 0.08)",
              border: "1px solid oklch(0.55 0.28 290 / 0.25)",
            }}
          >
            <p className="text-xs font-mono tracking-wide text-muted-foreground/80 leading-relaxed">
              <span style={{ color: "oklch(var(--glow) / 0.9)" }}>
                ✓ Public gallery is showing 6 default showcase images.
              </span>
              <br />
              Add your own images above to replace them.
            </p>
          </div>
        </div>
      ) : (
        <div data-ocid="admin.gallery.list" className="flex flex-col gap-2">
          {images.map((img, i) => (
            <motion.div
              key={img.id.toString()}
              data-ocid={`admin.gallery.item.${i + 1}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="flex items-center gap-4 rounded-xl p-3 group"
              style={{
                background: "oklch(0.10 0.04 280 / 0.6)",
                border: "1px solid oklch(var(--border) / 0.5)",
              }}
            >
              {/* Thumbnail */}
              <div
                className="w-16 h-12 rounded-lg flex-shrink-0 overflow-hidden"
                style={{
                  background: "oklch(0.08 0.03 280)",
                  border: "1px solid oklch(var(--border) / 0.4)",
                }}
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {img.caption || (
                    <span className="text-muted-foreground italic">
                      No caption
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {img.url}
                </p>
              </div>

              {/* Confirm delete */}
              {confirmDeleteId === img.id ? (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground font-mono">
                    Delete?
                  </span>
                  <button
                    type="button"
                    data-ocid={`admin.gallery.delete_button.${i + 1}`}
                    onClick={() => handleDelete(img.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none"
                    style={{
                      background: "oklch(0.577 0.245 27 / 0.2)",
                      border: "1px solid oklch(0.577 0.245 27 / 0.5)",
                      color: "oklch(0.75 0.18 27)",
                    }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    data-ocid="admin.gallery.cancel_button"
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none"
                    style={{
                      background: "oklch(0.12 0.03 280 / 0.5)",
                      border: "1px solid oklch(var(--border) / 0.4)",
                    }}
                  >
                    No
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    data-ocid={`admin.gallery.edit_button.${i + 1}`}
                    onClick={() => openEdit(img)}
                    className="p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    style={{
                      background: "oklch(0.55 0.28 290 / 0.15)",
                      border: "1px solid oklch(0.55 0.28 290 / 0.35)",
                      color: "oklch(var(--glow))",
                    }}
                    aria-label={`Edit ${img.caption}`}
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(img.id)}
                    disabled={deletingId === img.id}
                    className="p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50 disabled:opacity-50"
                    style={{
                      background: "oklch(0.577 0.245 27 / 0.15)",
                      border: "1px solid oklch(0.577 0.245 27 / 0.35)",
                      color: "oklch(0.75 0.18 27)",
                    }}
                    aria-label={`Delete ${img.caption}`}
                  >
                    {deletingId === img.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

const DEFAULT_AVATAR = "/assets/generated/roni-avatar.dim_400x400.jpg";

function AboutTab({ actor }: { actor: ReturnType<typeof useActor>["actor"] }) {
  const [currentImage, setCurrentImage] = useState<string>(DEFAULT_AVATAR);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCurrentImage = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    setError("");
    try {
      const img = await actor.getAboutImage();
      setCurrentImage(img ?? DEFAULT_AVATAR);
      setError("");
    } catch (err) {
      console.error("Failed to load profile image:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Failed to load current image. ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    fetchCurrentImage();
  }, [fetchCurrentImage]);

  const handleFileLoad = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setSaveError("Only image files are accepted.");
      return;
    }
    setSaveError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setSelectedFile(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileLoad(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileLoad(file);
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!actor || !selectedFile) return;
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      await actor.setAboutImage(selectedFile);
      setCurrentImage(selectedFile);
      setSelectedFile("");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError("Failed to save image. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: "oklch(0.09 0.03 280 / 0.85)",
    border: "1px solid oklch(0.28 0.08 285 / 0.7)",
    backdropFilter: "blur(12px)",
  };

  if (loading || !actor) {
    return (
      <div
        data-ocid="admin.about.loading_state"
        className="flex flex-col items-center justify-center py-20 gap-4"
      >
        <Loader2
          size={28}
          className="animate-spin"
          style={{ color: "oklch(var(--glow))" }}
        />
        <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
          Loading profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        data-ocid="admin.about.error_state"
        className="flex flex-col items-center justify-center py-20 gap-4"
      >
        <AlertCircle size={28} className="text-destructive" />
        <p className="text-sm text-destructive text-center max-w-sm">{error}</p>
        <button
          type="button"
          data-ocid="admin.about.button"
          onClick={fetchCurrentImage}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          style={{
            background: "oklch(0.55 0.28 290 / 0.15)",
            border: "1px solid oklch(0.55 0.28 290 / 0.4)",
            color: "oklch(var(--glow))",
          }}
        >
          <RefreshCw size={13} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Current image preview */}
      <div className="flex flex-col gap-3">
        <p
          className="text-[10px] font-mono tracking-[0.3em] uppercase"
          style={{ color: "oklch(var(--primary) / 0.7)" }}
        >
          {"// Current Profile Image"}
        </p>
        <div className="flex items-center gap-4">
          <div
            className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0"
            style={{
              boxShadow:
                "0 0 20px oklch(0.55 0.28 290 / 0.3), inset 0 0 0 1px oklch(0.55 0.28 290 / 0.3)",
              ...inputStyle,
            }}
          >
            <img
              src={currentImage}
              alt="Current About Me avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground">
              About Me Photo
            </p>
            <p className="text-xs text-muted-foreground">
              This image is displayed in the About section of your portfolio.
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.55 0.28 290 / 0.3), transparent)",
        }}
      />

      {/* Upload new image */}
      <div className="flex flex-col gap-3">
        <p
          className="text-[10px] font-mono tracking-[0.3em] uppercase"
          style={{ color: "oklch(var(--primary) / 0.7)" }}
        >
          {"// Upload New Image"}
        </p>

        {/* Hidden file input */}
        <input
          id="about-img-file"
          ref={fileInputRef}
          data-ocid="admin.about.upload_button"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileInputChange}
          tabIndex={-1}
        />

        {/* Dropzone */}
        <label
          htmlFor="about-img-file"
          data-ocid="admin.about.dropzone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="relative flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-200 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 select-none"
          style={{
            minHeight: selectedFile ? "0" : "150px",
            background: isDragOver
              ? "oklch(0.12 0.06 285 / 0.9)"
              : "oklch(0.09 0.03 280 / 0.85)",
            border: isDragOver
              ? "1.5px solid oklch(0.55 0.28 290 / 0.8)"
              : "1.5px dashed oklch(0.28 0.08 285 / 0.6)",
            backdropFilter: "blur(12px)",
            boxShadow: isDragOver
              ? "0 0 20px oklch(0.55 0.28 290 / 0.25), inset 0 0 20px oklch(0.55 0.28 290 / 0.07)"
              : "none",
          }}
        >
          {isDragOver && (
            <div
              className="absolute inset-0 pointer-events-none rounded-xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, oklch(0.55 0.28 290 / 0.1) 0%, transparent 70%)",
              }}
            />
          )}

          {selectedFile ? (
            <div className="relative w-full group">
              <img
                src={selectedFile}
                alt="Selected preview"
                className="w-full max-h-52 object-contain rounded-xl"
                style={{ display: "block" }}
              />
              <div
                className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  background: "oklch(0.06 0.03 280 / 0.75)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <Upload size={20} style={{ color: "oklch(var(--glow))" }} />
                <span className="text-[10px] font-mono tracking-widest uppercase text-foreground">
                  Replace image
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-10 px-6 pointer-events-none">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: "oklch(0.55 0.28 290 / 0.12)",
                  border: "1px solid oklch(0.55 0.28 290 / 0.3)",
                }}
              >
                <Upload
                  size={20}
                  style={{
                    color: isDragOver
                      ? "oklch(0.85 0.18 290)"
                      : "oklch(var(--glow))",
                  }}
                />
              </div>
              <div className="text-center">
                <p
                  className="text-xs font-mono tracking-widest uppercase mb-1"
                  style={{
                    color: isDragOver
                      ? "oklch(0.85 0.18 290)"
                      : "oklch(var(--glow) / 0.8)",
                  }}
                >
                  {isDragOver ? "Drop to upload" : "Drop image here"}
                </p>
                <p className="text-[10px] font-mono tracking-wider text-muted-foreground/60">
                  or click to browse files
                </p>
              </div>
            </div>
          )}
        </label>

        {/* Error / success feedback */}
        {saveError && (
          <p
            data-ocid="admin.about.error_state"
            className="text-xs text-destructive flex items-center gap-1.5"
          >
            <AlertCircle size={12} />
            {saveError}
          </p>
        )}

        {saveSuccess && (
          <motion.p
            data-ocid="admin.about.success_state"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs flex items-center gap-1.5"
            style={{ color: "oklch(0.72 0.17 150)" }}
          >
            <CheckCircle2 size={12} />
            Image updated successfully!
          </motion.p>
        )}

        {/* Save button */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            data-ocid="admin.about.save_button"
            onClick={handleSave}
            disabled={!selectedFile || saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            style={{
              background: selectedFile
                ? "linear-gradient(135deg, oklch(0.38 0.32 292) 0%, oklch(0.52 0.30 288) 100%)"
                : "oklch(0.55 0.28 290 / 0.12)",
              boxShadow: selectedFile
                ? "0 0 20px oklch(0.55 0.28 290 / 0.35)"
                : "none",
              border: "1px solid oklch(0.55 0.28 290 / 0.4)",
              color: "oklch(0.98 0.005 280)",
            }}
          >
            {saving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <CheckCircle2 size={13} />
            )}
            {saving ? "Saving..." : "Save Image"}
          </button>

          {selectedFile && (
            <button
              type="button"
              data-ocid="admin.about.cancel_button"
              onClick={() => {
                setSelectedFile("");
                setSaveError("");
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border/50"
              style={{
                background: "oklch(0.12 0.03 280 / 0.5)",
                border: "1px solid oklch(var(--border) / 0.4)",
              }}
            >
              <X size={13} />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Website Showcase Tab (read-only) ───────────────────────── */
const WEBSITE_PROJECTS = [
  {
    title: "Jerry SMP Website",
    type: "Minecraft Server Website",
    role: "Developer",
  },
  {
    title: "Minecraft Server Websites",
    type: "Web Development",
    role: "Developer",
  },
];

function WebsiteShowcaseTab() {
  return (
    <div className="flex flex-col gap-4">
      {/* Info banner */}
      <div
        className="flex items-start gap-3 rounded-xl p-4"
        style={{
          background: "oklch(0.55 0.28 290 / 0.07)",
          border: "1px solid oklch(0.55 0.28 290 / 0.25)",
        }}
      >
        <Globe
          size={15}
          style={{
            color: "oklch(var(--glow) / 0.8)",
            marginTop: 1,
            flexShrink: 0,
          }}
        />
        <p className="text-xs font-mono tracking-wide text-muted-foreground/80 leading-relaxed">
          Website projects are managed in code.{" "}
          <span style={{ color: "oklch(var(--glow) / 0.9)" }}>
            Contact the developer to add, edit, or remove entries.
          </span>
        </p>
      </div>

      {/* Project cards */}
      <div className="flex flex-col gap-3">
        {WEBSITE_PROJECTS.map((project, i) => (
          <motion.div
            key={project.title}
            data-ocid={`admin.website-showcase.item.${i + 1}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="rounded-xl p-5 relative overflow-hidden"
            style={{
              background: "oklch(0.10 0.04 280 / 0.7)",
              border: "1px solid oklch(var(--border) / 0.6)",
              boxShadow: "0 4px 20px oklch(0 0 0 / 0.3)",
            }}
          >
            {/* Top glow line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, oklch(0.55 0.28 290 / 0.4) 50%, transparent 100%)",
              }}
            />

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: "oklch(0.55 0.28 290 / 0.12)",
                    border: "1px solid oklch(0.55 0.28 290 / 0.3)",
                  }}
                >
                  <Monitor size={15} style={{ color: "oklch(var(--glow))" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {project.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono tracking-widest uppercase"
                      style={{
                        background: "oklch(0.55 0.28 290 / 0.12)",
                        border: "1px solid oklch(0.55 0.28 290 / 0.3)",
                        color: "oklch(var(--glow) / 0.9)",
                      }}
                    >
                      {project.type}
                    </span>
                    <span
                      className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono tracking-widest uppercase text-muted-foreground"
                      style={{
                        background: "oklch(0.12 0.03 280 / 0.6)",
                        border: "1px solid oklch(var(--border) / 0.4)",
                      }}
                    >
                      {project.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p
              className="text-[10px] font-mono tracking-wide text-muted-foreground/60 mt-3 leading-relaxed"
              style={{
                paddingLeft: "3rem",
              }}
            >
              Managed in code — contact developer to update.
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main AdminPanel ────────────────────────────────────────── */
export default function AdminPanel({ open, onClose }: AdminPanelProps) {
  const [tab, setTab] = useState<Tab>("transmissions");
  const { actor, isFetching } = useActor();
  const panelRef = useRef<HTMLDivElement>(null);
  const actorRef = useRef(actor);
  const [actorTimedOut, setActorTimedOut] = useState(false);

  // Keep actorRef current so the timeout callback can check latest value
  useEffect(() => {
    actorRef.current = actor;
  }, [actor]);

  // 15-second timeout for actor initialisation
  // Reset timeout whenever panel opens or actor becomes available
  useEffect(() => {
    if (!open) return;
    setActorTimedOut(false);
    if (actor) return; // already ready, no need for timeout
    const timer = setTimeout(() => {
      // Only mark as timed out if actor still isn't available
      if (!actorRef.current) {
        setActorTimedOut(true);
      }
    }, 15000);
    return () => clearTimeout(timer);
  }, [open, actor]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus trap
  useEffect(() => {
    if (open) {
      setTimeout(() => panelRef.current?.focus(), 50);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-ocid="admin.panel.modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "oklch(0.04 0.015 280 / 0.92)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Backdrop noise */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
              opacity: 0.15,
            }}
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl focus:outline-none"
            style={{
              background: "oklch(0.10 0.04 278 / 0.85)",
              backdropFilter: "blur(48px) saturate(180%)",
              WebkitBackdropFilter: "blur(48px) saturate(180%)",
              border: "1px solid oklch(0.55 0.28 290 / 0.35)",
              boxShadow:
                "0 0 0 1px oklch(0.28 0.08 285 / 0.3), 0 30px 80px oklch(0 0 0 / 0.7), 0 0 80px oklch(0.55 0.28 290 / 0.08)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top glow line */}
            <div
              className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, oklch(0.55 0.28 290 / 0.8) 50%, transparent 100%)",
              }}
            />

            {/* Ambient corner glow */}
            <div
              className="absolute top-0 right-0 w-64 h-64 pointer-events-none rounded-2xl"
              style={{
                background:
                  "radial-gradient(circle at top right, oklch(0.55 0.28 290 / 0.08) 0%, transparent 70%)",
              }}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: "oklch(var(--glow))" }}
                  />
                  <span
                    className="text-[10px] font-mono tracking-[0.35em] uppercase"
                    style={{ color: "oklch(var(--primary) / 0.7)" }}
                  >
                    Admin Console
                  </span>
                </div>
                <h2
                  className="font-heading font-black text-lg tracking-tight"
                  style={{ fontVariationSettings: '"wdth" 125' }}
                >
                  Control Panel
                </h2>
              </div>
              <button
                type="button"
                data-ocid="admin.close_button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                style={{
                  background: "oklch(0.14 0.04 280 / 0.6)",
                  border: "1px solid oklch(var(--border) / 0.5)",
                }}
                aria-label="Close admin panel"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tab bar */}
            <div
              className="flex gap-1 mx-6 mb-5 p-1 rounded-xl shrink-0"
              style={{
                background: "oklch(0.07 0.02 280 / 0.8)",
                border: "1px solid oklch(var(--border) / 0.4)",
              }}
            >
              <button
                type="button"
                data-ocid="admin.transmissions.tab"
                onClick={() => setTab("transmissions")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                style={
                  tab === "transmissions"
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(0.38 0.32 292 / 0.5) 0%, oklch(0.52 0.30 288 / 0.35) 100%)",
                        border: "1px solid oklch(0.55 0.28 290 / 0.5)",
                        color: "oklch(var(--glow))",
                        boxShadow: "0 0 15px oklch(0.55 0.28 290 / 0.15)",
                      }
                    : {
                        color: "oklch(var(--muted-foreground))",
                      }
                }
              >
                <Radio size={13} />
                Transmissions
              </button>
              <button
                type="button"
                data-ocid="admin.server-showcase.tab"
                onClick={() => setTab("gallery")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                style={
                  tab === "gallery"
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(0.38 0.32 292 / 0.5) 0%, oklch(0.52 0.30 288 / 0.35) 100%)",
                        border: "1px solid oklch(0.55 0.28 290 / 0.5)",
                        color: "oklch(var(--glow))",
                        boxShadow: "0 0 15px oklch(0.55 0.28 290 / 0.15)",
                      }
                    : {
                        color: "oklch(var(--muted-foreground))",
                      }
                }
              >
                <Server size={13} />
                Server
              </button>
              <button
                type="button"
                data-ocid="admin.website-showcase.tab"
                onClick={() => setTab("website-showcase")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                style={
                  tab === "website-showcase"
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(0.38 0.32 292 / 0.5) 0%, oklch(0.52 0.30 288 / 0.35) 100%)",
                        border: "1px solid oklch(0.55 0.28 290 / 0.5)",
                        color: "oklch(var(--glow))",
                        boxShadow: "0 0 15px oklch(0.55 0.28 290 / 0.15)",
                      }
                    : {
                        color: "oklch(var(--muted-foreground))",
                      }
                }
              >
                <Monitor size={13} />
                Websites
              </button>
              <button
                type="button"
                data-ocid="admin.about.tab"
                onClick={() => setTab("about")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono font-bold tracking-widest uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                style={
                  tab === "about"
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(0.38 0.32 292 / 0.5) 0%, oklch(0.52 0.30 288 / 0.35) 100%)",
                        border: "1px solid oklch(0.55 0.28 290 / 0.5)",
                        color: "oklch(var(--glow))",
                        boxShadow: "0 0 15px oklch(0.55 0.28 290 / 0.15)",
                      }
                    : {
                        color: "oklch(var(--muted-foreground))",
                      }
                }
              >
                <UserCircle size={13} />
                About Me
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {/* Actor connecting state — show full-panel spinner while actor initialises */}
              {!actor ? (
                actorTimedOut && !isFetching ? (
                  <div
                    data-ocid="admin.panel.error_state"
                    className="flex flex-col items-center justify-center py-20 gap-4"
                  >
                    <AlertCircle size={28} className="text-destructive" />
                    <p className="text-sm text-destructive text-center max-w-xs">
                      Could not connect to the network. Please check your
                      connection and try again.
                    </p>
                    <button
                      type="button"
                      data-ocid="admin.panel.button"
                      onClick={() => window.location.reload()}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      style={{
                        background: "oklch(0.55 0.28 290 / 0.15)",
                        border: "1px solid oklch(0.55 0.28 290 / 0.4)",
                        color: "oklch(var(--glow))",
                      }}
                    >
                      <RefreshCw size={13} />
                      Reload Page
                    </button>
                  </div>
                ) : (
                  <div
                    data-ocid="admin.panel.loading_state"
                    className="flex flex-col items-center justify-center py-20 gap-4"
                  >
                    <Loader2
                      size={28}
                      className="animate-spin"
                      style={{ color: "oklch(var(--glow))" }}
                    />
                    <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
                      Connecting to network...
                    </p>
                  </div>
                )
              ) : (
                <AnimatePresence mode="wait">
                  {tab === "transmissions" && (
                    <motion.div
                      key="transmissions"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <MessageSquare
                          size={14}
                          style={{ color: "oklch(var(--primary) / 0.7)" }}
                        />
                        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground">
                          Incoming Transmissions
                        </span>
                      </div>
                      <TransmissionsTab actor={actor} />
                    </motion.div>
                  )}
                  {tab === "gallery" && (
                    <motion.div
                      key="gallery"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Server
                          size={14}
                          style={{ color: "oklch(var(--primary) / 0.7)" }}
                        />
                        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground">
                          Server Showcase Images
                        </span>
                      </div>
                      <GalleryTab actor={actor} />
                    </motion.div>
                  )}
                  {tab === "website-showcase" && (
                    <motion.div
                      key="website-showcase"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Monitor
                          size={14}
                          style={{ color: "oklch(var(--primary) / 0.7)" }}
                        />
                        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground">
                          Website Projects
                        </span>
                      </div>
                      <WebsiteShowcaseTab />
                    </motion.div>
                  )}
                  {tab === "about" && (
                    <motion.div
                      key="about"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <UserCircle
                          size={14}
                          style={{ color: "oklch(var(--primary) / 0.7)" }}
                        />
                        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground">
                          Profile Image
                        </span>
                      </div>
                      <AboutTab actor={actor} />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
