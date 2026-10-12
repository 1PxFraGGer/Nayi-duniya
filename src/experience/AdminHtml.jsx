import {useMemo,useRef,useEffect} from 'react';
import {getImageUrl} from '../utils/imageUrl';
export default function AdminHtml({ html }) {
  const frameRef = useRef(null);
  const source = useMemo(() => {
    const doc = new DOMParser().parseFromString(
      String(html || "<p>Service details will be available soon.</p>"), "text/html"
    );
    doc.querySelectorAll("script, iframe, object, embed, base, meta, link, form, input, button, textarea, select, template").forEach((node) => node.remove());
    doc.querySelectorAll("*").forEach((element) => {
      for (const attribute of Array.from(element.attributes)) {
        if (/^on/i.test(attribute.name) || ["srcdoc", "autofocus", "ping"].includes(attribute.name.toLowerCase())) {
          element.removeAttribute(attribute.name);
        }
      }
    });
    doc.querySelectorAll("a").forEach((link) => {
      const href = link.getAttribute("href")?.trim();
      if (href?.startsWith("#")) return;
      // Only explicit, ordinary outbound links may open a new browser tab.
      if (href && /^(https?:\/\/|mailto:|tel:)/i.test(href)) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      } else {
        link.removeAttribute("href");
        link.removeAttribute("target");
      }
    });
    doc.querySelectorAll("img").forEach((image) => {
      const src = image.getAttribute("src");
      if (src && !/^(https?:|data:|\/\/)/i.test(src)) image.setAttribute("src", getImageUrl(src));
      if (!image.hasAttribute("alt")) image.setAttribute("alt", "");
    });
    const adminStyles = Array.from(doc.head.querySelectorAll("style")).map((style) => style.outerHTML).join("\n");
    return `<!doctype html><html lang="en"><head><meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'none'; style-src 'unsafe-inline' https:; img-src https: http: data:; font-src https: data:; base-uri 'none'; form-action 'none'; object-src 'none'; frame-src 'none'">
      <style>
        :root { color-scheme: light; }
        html { margin: 0; padding: 0; background: transparent; }
        body { margin: 0; padding: 0; color: #566052; font: 14px/1.7 'Inter', 'Segoe UI', sans-serif; overflow-wrap: anywhere; }
        #sd-admin-root { display: flow-root; min-width: 0; }
        img, video { max-width: 100%; height: auto; }
        table { max-width: 100%; }
        a { color: #334938; text-underline-offset: 3px; }
        :focus-visible { outline: 2px solid #66823a; outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; } }
      </style>${adminStyles}</head><body><div id="sd-admin-root">${doc.body.innerHTML}</div></body></html>`;
  }, [html]);

  useEffect(() => {
    const frame = frameRef.current;
    let observer;
    let scheduled;
    let currentDocument;
    const resize = () => {
      cancelAnimationFrame(scheduled);
      scheduled = requestAnimationFrame(() => {
        const root = frame.contentDocument?.getElementById("sd-admin-root");
        if (!root) return;
        const height = Math.ceil(Math.max(root.getBoundingClientRect().height, root.scrollHeight)) + 2;
        if (frame.style.height !== `${height}px`) frame.style.height = `${height}px`;
      });
    };
    const connect = () => {
      observer?.disconnect();
      currentDocument?.removeEventListener("load", resize, true);
      currentDocument = frame.contentDocument;
      const root = currentDocument?.getElementById("sd-admin-root");
      if (!root) return;
      observer = new ResizeObserver(resize);
      observer.observe(root);
      currentDocument.addEventListener("load", resize, true);
      resize();
    };
    frame.addEventListener("load", connect);
    window.addEventListener("resize", resize);
    connect();
    return () => {
      frame.removeEventListener("load", connect);
      window.removeEventListener("resize", resize);
      currentDocument?.removeEventListener("load", resize, true);
      observer?.disconnect();
      cancelAnimationFrame(scheduled);
    };
  }, [source]);

  return <div className="sd-admin-content"><iframe ref={frameRef}
    className="sd-admin-frame" title="Service description and inclusions"
    sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
    referrerPolicy="no-referrer" srcDoc={source} /></div>;
}

