import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import HeroSection from "@/components/home/HeroSection";
import StickyBottomSearch from "@/components/home/StickyBottomSearch";
import HomePage from "@/app/page";
import { preparePendingMediaPayload } from "@/lib/mediaUtils";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

describe("Multimodal Accueil 360° (HeroSection & StickyBottomSearch parity)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("1. Validation média & transfert (mediaUtils)", () => {
    it("rejette un format non supporté (.txt) avec un message clair", async () => {
      const txtFile = new File(["hello"], "notes.txt", { type: "text/plain" });
      const result = await preparePendingMediaPayload(txtFile, "");

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toMatch(/Format non supporté/i);
      }
    });

    it("rejette un fichier dépassant 20 Mo", async () => {
      const bigFile = new File(["x"], "huge.png", { type: "image/png" });
      Object.defineProperty(bigFile, "size", { value: 21 * 1024 * 1024 });

      const result = await preparePendingMediaPayload(bigFile, "");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toMatch(/20 Mo/i);
      }
    });

    it("prépare correctement une capture PNG valide avec prompt texte", async () => {
      const pngFile = new File(["png-bytes"], "capture.png", { type: "image/png" });
      const result = await preparePendingMediaPayload(pngFile, "Est-ce légal ?");

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.payload.name).toBe("capture.png");
        expect(result.payload.type).toBe("image/png");
        expect(result.payload.prompt).toBe("Est-ce légal ?");
        expect(result.payload.dataUrl).toMatch(/^data:/);
      }
    });
  });

  describe("2. Parité DOM, Capture + Texte & Enregistrement vocal sur Barre 1 et Barre 2", () => {
    const setupMediaRecorderMock = () => {
      const stopTrack = vi.fn();
      const mockStream = {
        getTracks: () => [{ stop: stopTrack }],
      } as unknown as MediaStream;

      let instance: {
        mimeType: string;
        state: string;
        ondataavailable: ((e: { data: Blob }) => void) | null;
        onstop: (() => void) | null;
        start: ReturnType<typeof vi.fn>;
        stop: ReturnType<typeof vi.fn>;
        stream: MediaStream;
      } | null = null;

      class MockMediaRecorder {
        mimeType = "audio/webm";
        state = "inactive";
        ondataavailable: ((e: { data: Blob }) => void) | null = null;
        onstop: (() => void) | null = null;
        stream = mockStream;
        start = vi.fn(() => {
          this.state = "recording";
        });
        stop = vi.fn(() => {
          this.state = "inactive";
          this.ondataavailable?.({ data: new Blob(["audio-chunk"], { type: "audio/webm" }) });
          this.onstop?.();
        });
        constructor() {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          instance = this;
        }
      }

      Object.defineProperty(navigator, "mediaDevices", {
        value: {
          getUserMedia: vi.fn().mockResolvedValue(mockStream),
        },
        configurable: true,
      });
      Object.defineProperty(window, "MediaRecorder", {
        value: MockMediaRecorder,
        configurable: true,
      });
      Object.defineProperty(globalThis, "MediaRecorder", {
        value: MockMediaRecorder,
        configurable: true,
      });

      return () => instance;
    };

    it("HeroSection (Barre 1) possède id/name sur file input, transmet Texte+Image et enregistre l'audio via MediaRecorder", async () => {
      setupMediaRecorderMock();
      const onSearch = vi.fn();
      const onMediaSearch = vi.fn();

      render(<HeroSection onSearch={onSearch} onMediaSearch={onMediaSearch} />);

      const fileInput = screen.getByLabelText(/Sélectionner une capture d'écran/i);
      expect(fileInput).toHaveAttribute("id", "hero-file-input");
      expect(fileInput).toHaveAttribute("name", "hero_media");

      // Texte + Image
      const textInput = screen.getByLabelText(/Posez votre question sur le Code du numérique/i);
      fireEvent.change(textInput, { target: { value: "Que risque l'auteur ?" } });

      const img = new File(["img"], "whatsapp.png", { type: "image/png" });
      fireEvent.change(fileInput, { target: { files: [img] } });
      expect(onMediaSearch).toHaveBeenCalledWith(img, "Que risque l'auteur ?");

      // Note vocale MediaRecorder
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: /Note vocale/i }));
      });

      expect(await screen.findByText(/Enregistrement vocal : 0:00/i)).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /Envoyer l'audio/i }));

      expect(onMediaSearch).toHaveBeenCalledTimes(2);
      const sentAudio = onMediaSearch.mock.calls[1][0];
      expect(sentAudio).toBeInstanceOf(Blob);
      expect((sentAudio as Blob).type).toBe("audio/webm");
      expect(onSearch).not.toHaveBeenCalled();
    });

    it("StickyBottomSearch (Barre 2) possède id/name sur file input, transmet Texte+Image et enregistre l'audio via MediaRecorder", async () => {
      setupMediaRecorderMock();
      const onSearch = vi.fn();
      const onMediaSearch = vi.fn();

      render(
        <StickyBottomSearch onSearch={onSearch} onMediaSearch={onMediaSearch} forceVisible={true} />
      );

      const fileInput = screen.getByLabelText(/Sélectionner une capture d'écran/i);
      expect(fileInput).toHaveAttribute("id", "sticky-file-input");
      expect(fileInput).toHaveAttribute("name", "sticky_media");

      // Texte + Image
      const textInput = screen.getByLabelText(/Posez votre question sur le Code du numérique/i);
      fireEvent.change(textInput, { target: { value: "Analyse cette preuve" } });

      const img = new File(["img"], "capture.jpg", { type: "image/jpeg" });
      fireEvent.change(fileInput, { target: { files: [img] } });
      expect(onMediaSearch).toHaveBeenCalledWith(img, "Analyse cette preuve");

      // Note vocale MediaRecorder
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: /Note vocale/i }));
      });

      expect(await screen.findByText(/Enregistrement vocal : 0:00/i)).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /Envoyer l'audio/i }));

      expect(onMediaSearch).toHaveBeenCalledTimes(2);
      const sentAudio = onMediaSearch.mock.calls[1][0];
      expect(sentAudio).toBeInstanceOf(Blob);
      expect((sentAudio as Blob).type).toBe("audio/webm");
      expect(onSearch).not.toHaveBeenCalled();
    });

    it("affiche une erreur explicite (role=alert) sans fausse question simulée si le micro est refusé", async () => {
      Object.defineProperty(navigator, "mediaDevices", {
        value: {
          getUserMedia: vi.fn().mockRejectedValue(new DOMException("Permission denied", "NotAllowedError")),
        },
        configurable: true,
      });

      const onSearch = vi.fn();
      render(<HeroSection onSearch={onSearch} />);

      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: /Note vocale/i }));
      });

      const alert = await screen.findByRole("alert");
      expect(alert).toHaveTextContent(/Accès au microphone refusé/i);
      expect(onSearch).not.toHaveBeenCalled();
    });
  });

  describe("3. Intégration HomePage (/ -> /chat?media=pending ou erreur)", () => {
    it("affiche une erreur sans rediriger si un fichier invalide est soumis depuis l'accueil", async () => {
      render(<HomePage />);

      const fileInputs = screen.getAllByLabelText(/Sélectionner une capture d'écran/i);
      const invalidFile = new File(["bad"], "doc.txt", { type: "text/plain" });

      await act(async () => {
        fireEvent.change(fileInputs[0], { target: { files: [invalidFile] } });
      });

      await waitFor(() => {
        expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
      });
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("stocke lexbenin_pending_media et redirige vers /chat?media=pending pour une image valide", async () => {
      render(<HomePage />);

      const fileInputs = screen.getAllByLabelText(/Sélectionner une capture d'écran/i);
      const pngFile = new File(["png"], "preuve.png", { type: "image/png" });

      await act(async () => {
        fireEvent.change(fileInputs[0], { target: { files: [pngFile] } });
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/chat?media=pending");
      });
      expect(sessionStorage.getItem("lexbenin_pending_media")).toContain("preuve.png");
    });
  });
});
