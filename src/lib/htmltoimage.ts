import { toBlob } from 'html-to-image';

export async function generatePreviewImage(divId: string): Promise<Blob | null> {
  const element = document.getElementById(divId);
  if (!element) return null;

  const affected: { el: HTMLElement, original: Partial<CSSStyleDeclaration> }[] = [];

  element.querySelectorAll("*").forEach((el) => {
    const htmlEl = el as HTMLElement;
    const style = window.getComputedStyle(htmlEl);

    // Deteksi text dengan gradient
    if (
      style.getPropertyValue("background-image").includes("linear-gradient") &&
      style.getPropertyValue("-webkit-background-clip") === "text"
    ) {
      affected.push({
        el: htmlEl,
        original: {
          backgroundImage: htmlEl.style.backgroundImage,
          color: htmlEl.style.color,
          webkitBackgroundClip: htmlEl.style.webkitBackgroundClip,
          webkitTextFillColor: htmlEl.style.webkitTextFillColor,
        },
      });

      // Override sementara agar terlihat di canvas
      htmlEl.style.backgroundImage = "none";
      htmlEl.style.color = "black";
      htmlEl.style.webkitBackgroundClip = "initial";
      htmlEl.style.webkitTextFillColor = "initial";
    }
  });

  const blob = await toBlob(element, {
    cacheBust: true,
    backgroundColor: "",
  });

  // Restore style aslinya
  affected.forEach(({ el, original }) => {
    if (original.backgroundImage !== undefined)
      el.style.backgroundImage = original.backgroundImage || "";
    if (original.color !== undefined)
      el.style.color = original.color || "";
    if (original.webkitBackgroundClip !== undefined)
      el.style.webkitBackgroundClip = original.webkitBackgroundClip || "";
    if (original.webkitTextFillColor !== undefined)
      el.style.webkitTextFillColor = original.webkitTextFillColor || "";
  });

  return blob;
}

