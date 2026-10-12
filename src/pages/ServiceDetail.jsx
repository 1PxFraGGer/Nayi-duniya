import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion as Motion, useReducedMotion } from "framer-motion";
import API from "../services/api";
import { getImageUrl } from "../utils/imageUrl";
import { useAuth } from "../context/AuthContext";
import "./serviceDetails.css";

const money = (value) => value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value))
  ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value))
  : "Price on request";
const list = (value) => Array.isArray(value) ? value : [];
const errorText = (error, fallback) => error.response?.data?.message || error.response?.data?.msg || fallback;
const localDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const addressText = (address) => address ? [address.fullName, address.mobile, address.houseNo,
  address.addressLine1, address.addressLine2, address.landmark, address.city, address.state,
  address.pincode, address.country].filter(Boolean).join(", ") : "";

// Keep admin HTML and inline CSS in a separate document so neither stylesheet
// can override the other. The iframe permits same-origin sizing, never scripts.
function Description({ html }) {
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

function ServiceImage({ src, alt, ...props }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <div className="sd-image-fallback" role="img" aria-label={alt}><span aria-hidden="true">SH</span><small>Service image unavailable</small></div>;
  return <img src={src} alt={alt} onError={() => setFailed(true)} {...props} />;
}

function Notice({ notice }) {
  return <div className="sd-notice-region" aria-live="polite" aria-atomic="true">
    {notice && <p className={`sd-notice sd-notice--${notice.kind}`} role={notice.kind === "error" ? "alert" : undefined}>{notice.text}</p>}
  </div>;
}

export default function ServiceDetail() {
  const { id } = useParams();
  // A different service gets fresh form and gallery state.
  return <ServiceDetailPage key={id} id={id} />;
}

function ServiceDetailPage({ id }) {
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const reducedMotion = useReducedMotion();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reload, setReload] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [addressReload, setAddressReload] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [form, setForm] = useState(() => { const preferred = searchParams.get("preferred"); const d = new Date(); if (preferred === "Tomorrow") d.setDate(d.getDate()+1); return { date: ["Today","Tomorrow"].includes(preferred) ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}` : "", time: "", notes: "" }; });
  const [notice, setNotice] = useState(null);
  const [reviewNotice, setReviewNotice] = useState(null);
  const [busy, setBusy] = useState("");
  const [reviewBusy, setReviewBusy] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const actionLock = useRef(false);
  const reviewLock = useRef(false);
  const dialogRef = useRef(null);
  const galleryButtonRef = useRef(null);
  const dateRef = useRef(null);
  const userId = user?.id ?? user?.email ?? null;

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        const response = await API.get(`/services/${id}`, { signal: controller.signal });
        if (!response.data || typeof response.data !== "object" || Array.isArray(response.data)) throw new Error("Invalid service");
        setService(response.data);
      } catch (error) {
        if (!controller.signal.aborted) setLoadError(errorText(error, "We couldn't load this service. Please try again."));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [id, reload]);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setReviewLoading(true);
      setReviewError("");
      try {
        const response = await API.get(`/comments/service/${id}`, { signal: controller.signal });
        setReviews(list(response.data?.comments ?? response.data));
      } catch {
        if (!controller.signal.aborted) setReviewError("Reviews are temporarily unavailable.");
      } finally {
        if (!controller.signal.aborted) setReviewLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [id, reload]);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setAddresses([]);
      setSelectedAddressId("");
      setAddressError("");
      setAddressLoading(false);
      if (authLoading || !userId) return;
      setAddressLoading(true);
      try {
        const response = await API.get("/customer/addresses", { signal: controller.signal });
        const data = list(response.data?.addresses ?? response.data?.data ?? response.data);
        setAddresses(data);
        const initial = data.find((address) => Number(address.isDefault) === 1) || data[0];
        setSelectedAddressId(initial ? String(initial.id) : "");
      } catch (error) {
        if (!controller.signal.aborted) setAddressError(errorText(error, "We couldn't load your saved addresses."));
      } finally {
        if (!controller.signal.aborted) setAddressLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [userId, authLoading, addressReload]);

  const selectedAddress = addresses.find((address) => String(address.id) === selectedAddressId);
  const images = (list(service?.images).length ? service.images : service?.image ? [service.image] : [])
    .filter((image) => typeof image === "string" && image.trim()).map(getImageUrl);
  const score = Number(service?.rating);
  const displayRating = Number.isFinite(score) && score > 0 && score <= 5 ? score.toFixed(1) : null;
  const reveal = (delay = 0) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.08 },
    transition: { duration: reducedMotion ? 0 : 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  });
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const focusBooking = () => {
    document.getElementById("sd-booking")?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
    dateRef.current?.focus({ preventScroll: true });
  };

  async function addToCart() {
    if (actionLock.current) return;
    if (!user) return setNotice({ kind: "error", text: "Please sign in to add this service to your cart." });
    actionLock.current = true;
    setBusy("cart");
    setNotice(null);
    try {
      await API.post("/cart", { service_id: Number(id), quantity: 1 });
      window.dispatchEvent(new Event("cartUpdated"));
      setNotice({ kind: "success", text: "Added to your cart. You can continue browsing or view your cart." });
    } catch (error) {
      setNotice({ kind: "error", text: errorText(error, "Couldn't add this service. Please try again.") });
    } finally { actionLock.current = false; setBusy(""); }
  }

  async function bookService(event) {
    event.preventDefault();
    if (actionLock.current) return;
    const fail = (text) => setNotice({ kind: "error", text });
    if (!user) return fail("Please sign in to book this service.");
    if (!user.phone) return fail("Please add your phone number using Edit profile below.");
    if (!selectedAddress) return fail("Please select a saved address before booking.");
    const fields = new FormData(event.currentTarget);
    const bookingDate = String(fields.get("date") || form.date);
    const bookingTime = String(fields.get("time") || form.time);
    const appointment = new Date(`${bookingDate}T${bookingTime}`);
    if (!bookingDate || !bookingTime || !Number.isFinite(appointment.getTime()) || appointment <= new Date()) {
      return fail("Please choose a future appointment date and time.");
    }
    actionLock.current = true;
    setBusy("booking");
    setNotice(null);
    try {
      await API.post("/bookings", {
        service_id: id, booking_date: bookingDate, booking_time: bookingTime,
        address: addressText(selectedAddress), address_id: selectedAddress.id,
        address_type: selectedAddress.addressType || null, full_name: selectedAddress.fullName || null,
        mobile: selectedAddress.mobile || null, house_no: selectedAddress.houseNo || null,
        address_line1: selectedAddress.addressLine1 || null, address_line2: selectedAddress.addressLine2 || null,
        landmark: selectedAddress.landmark || null, city: selectedAddress.city || null,
        state: selectedAddress.state || null, pincode: selectedAddress.pincode || null,
        country: selectedAddress.country || null, latitude: selectedAddress.latitude ?? null,
        longitude: selectedAddress.longitude ?? null, notes: form.notes.trim() || null,
      });
      setNotice({ kind: "success", text: "Your booking has been created. Open My bookings to see its latest status." });
      setForm({ date: "", time: "", notes: "" });
    } catch (error) {
      setNotice({ kind: "error", text: errorText(error, "We couldn't confirm the booking. Check My bookings before trying again.") });
    } finally { actionLock.current = false; setBusy(""); }
  }

  async function submitReview(event) {
    event.preventDefault();
    if (reviewLock.current) return;
    if (!user || !comment.trim()) return setReviewNotice({ kind: "error", text: "Sign in and write a review before submitting." });
    reviewLock.current = true;
    setReviewBusy(true);
    setReviewNotice(null);
    try {
      await API.post("/comments", { service_id: id, comment: comment.trim(), rating });
      setComment("");
      setRating(5);
      setReviewNotice({ kind: "success", text: "Thank you. Your review has been submitted for approval." });
    } catch (error) {
      setReviewNotice({ kind: "error", text: errorText(error, "Couldn't submit your review. Please try again.") });
    } finally { reviewLock.current = false; setReviewBusy(false); }
  }

  if (loading) return <div className="sd-page" aria-busy="true" aria-label="Loading service"><div className="sd-shell sd-loading"><p className="sd-eyebrow" role="status">Preparing the details</p><div className="sd-skeleton sd-skeleton--title" /><div className="sd-layout"><div className="sd-skeleton sd-skeleton--image" /><div className="sd-skeleton sd-skeleton--card" /></div></div></div>;
  if (loadError || !service) return <main className="sd-page"><div className="sd-shell sd-empty"><p className="sd-eyebrow">A small interruption</p><h1>Let’s try that again.</h1><p role="alert">{loadError || "This service is unavailable."}</p><button className="sd-button sd-button--primary" onClick={() => setReload((value) => value + 1)}>Retry</button><Link to="/services">Browse all services →</Link></div></main>;

  return <main className="sd-page">
    <div className="sd-ambient" aria-hidden="true" />
    <div className="sd-shell">
      <nav className="sd-breadcrumb" aria-label="Breadcrumb"><Link to="/services">← All services</Link><span aria-hidden="true">/</span><span aria-current="page">{service.title || "Service details"}</span></nav>
      <Motion.header className="sd-header sd-header--refined" {...reveal()}>
        <div className="sd-header-copy">
          <div className="sd-header-labels"><span className="sd-category-pill"><span aria-hidden="true" />{service.category_name || "Home services"}</span><span className="sd-header-brand">By ServiceHub</span></div>
          <h1>{service.title || "A little care for your home."}</h1>
          <div className="sd-header-links">{displayRating && <a className="sd-rate" href="#sd-reviews">★ {displayRating} / 5</a>}<a href="#sd-reviews">{reviewLoading ? "Loading reviews…" : reviews.length ? `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}` : "No reviews yet"}</a><a href="#sd-about-title">Service details <span aria-hidden="true">↓</span></a></div>
        </div>
        <div className="sd-header-summary">
          <div><span className="sd-header-price-label">Service price</span><strong className="sd-header-price">{money(service.price)}</strong></div>
          <button type="button" className="sd-button sd-button--primary" onClick={focusBooking}>Choose appointment <span aria-hidden="true">↗</span></button>
        </div>
      </Motion.header>
      <div className="sd-layout">
        <div className="sd-main-column">
          <Motion.section className="sd-gallery" aria-label="Service photos" {...reveal(0.06)}>
            <div className="sd-photo-stage">
              <AnimatePresence mode="wait" initial={false}><Motion.div className="sd-photo-frame" key={activeImage} initial={reducedMotion ? false : { opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.35 }}><ServiceImage key={images[activeImage] || "fallback"} src={images[activeImage]} alt={`${service.title || "Service"}, photo ${activeImage + 1}`} fetchPriority="high" /></Motion.div></AnimatePresence>
                            {images.length > 0 && <button type="button" className="sd-gallery-open" ref={galleryButtonRef} onClick={() => dialogRef.current?.showModal()} aria-label="Open full-size service photo">↗ <span>View photo</span></button>}
              {images.length > 1 && <span className="sd-photo-count">{String(activeImage + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>}
            </div>
            {images.length > 1 && <div className="sd-thumbnails" aria-label="Choose a photo">{images.map((src, index) => <button key={`${src}-${index}`} type="button" aria-label={`Show photo ${index + 1}`} aria-pressed={index === activeImage} className={index === activeImage ? "is-active" : ""} onClick={() => setActiveImage(index)}><ServiceImage key={src} src={src} alt="" loading="lazy" /></button>)}</div>}
          </Motion.section>
          <Motion.div className="sd-process" {...reveal()}>{[["01", "Make it yours", "Explore the service details"], ["02", "Pick your moment", "Choose your preferred time"], ["03", "Stay in the loop", "Follow your booking status"]].map(([number, title, text]) => <div key={number}><span>{number}</span><strong>{title}</strong><p>{text}</p></div>)}</Motion.div>
          <Motion.section className="sd-section" aria-labelledby="sd-about-title" {...reveal()}><p className="sd-eyebrow">The details</p><h2 id="sd-about-title">Good care starts here.</h2><Description html={service.description} /></Motion.section>
          <Motion.section className="sd-section" id="sd-reviews" aria-labelledby="sd-reviews-title" {...reveal()}>
            <div className="sd-section-heading"><div><p className="sd-eyebrow">Customer experiences</p><h2 id="sd-reviews-title">In their own words.</h2></div><span className="sd-count">{reviews.length}</span></div>
            {reviewLoading ? <p role="status">Loading reviews…</p> : reviewError ? <p role="status">{reviewError} <button className="sd-text-button" onClick={() => setReload((value) => value + 1)}>Retry</button></p> : reviews.length === 0 ? <div className="sd-review-empty"><span aria-hidden="true">“</span><p>No reviews yet.<br /><strong>Your experience could help someone decide.</strong></p></div> : <div className="sd-review-list">{reviews.map((review, index) => <article className="sd-review" key={review.id ?? index}><div className="sd-review-top"><span className="sd-avatar" aria-hidden="true">{String(review.user_name || "Customer").charAt(0).toUpperCase()}</span><strong>{review.user_name || "Customer"}</strong><span className="sd-stars" aria-label={`${Math.max(0, Math.min(5, Number(review.rating) || 0))} out of 5 stars`}>{"★".repeat(Math.max(0, Math.min(5, Math.round(Number(review.rating) || 0))))}</span></div><p>{review.comment}</p></article>)}</div>}
            <form className="sd-review-form" onSubmit={submitReview} aria-busy={reviewBusy}>
              <h3>Share your experience</h3><p>Your review will appear after approval.</p>
              {authLoading ? <p role="status">Checking your account…</p> : !user ? <Link to="/login" className="sd-inline-link">Sign in to leave a review ↗</Link> : <fieldset disabled={reviewBusy}><legend className="sd-sr-only">Write a review</legend><label htmlFor="sd-rating">Your rating</label><select id="sd-rating" value={rating} onChange={(event) => setRating(Number(event.target.value))}>{[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} {value === 1 ? "star" : "stars"}</option>)}</select><label htmlFor="sd-comment">Your review</label><textarea id="sd-comment" value={comment} onChange={(event) => setComment(event.target.value)} required maxLength={2000} rows={4} placeholder="What went well? What could be better?" /><button className="sd-button sd-button--dark" type="submit">{reviewBusy ? "Submitting…" : "Submit review ↗"}</button></fieldset>}
              <Notice notice={reviewNotice} />
            </form>
          </Motion.section>
        </div>
        <aside className="sd-booking-column" aria-label="Book this service"><Motion.section className="sd-booking-card" id="sd-booking" {...reveal(0.12)}>
          <div className="sd-card-top"><p className="sd-eyebrow">Book this service</p></div>
          <h2>Reserve your slot</h2><div className="sd-price-row"><strong>{money(service.price)}</strong><span>Service price</span></div>
          <p className="sd-booking-hint">Choose your preferred appointment. Availability is confirmed by the service team.</p>
          {authLoading ? <p role="status">Checking your account…</p> : !user ? <div className="sd-signin"><p>Sign in to choose your address and book this service.</p><Link to="/login" className="sd-button sd-button--primary">Sign in to book ↗</Link><Link to="/register">New here? Create an account</Link></div> : <form onSubmit={bookService} aria-busy={Boolean(busy)}>
            <fieldset disabled={Boolean(busy)}><legend className="sd-sr-only">Appointment details</legend>
              <div className="sd-contact"><span className="sd-avatar" aria-hidden="true">{String(user.name || "You").charAt(0).toUpperCase()}</span><div><strong>{user.name || "Your account"}</strong><small>{user.phone || "Add a phone number"}</small><small>{user.email}</small></div><Link to="/account/profile">Edit profile</Link></div>
              <div className="sd-field-heading"><h3><span>01</span> Your appointment</h3></div><div className="sd-fields-row"><div><label htmlFor="sd-date">Date</label><input ref={dateRef} id="sd-date" type="date" name="date" min={localDate()} value={form.date} onChange={change} required /></div><div><label htmlFor="sd-time">Time</label><input id="sd-time" type="time" name="time" value={form.time} onChange={change} required /></div></div>
              <div className="sd-field-heading"><h3><span>02</span> Your address</h3><Link to="/account/addresses">Manage ↗</Link></div>
              {addressLoading ? <p role="status">Loading saved addresses…</p> : addressError ? <div className="sd-address-empty"><p role="alert">{addressError}</p><button type="button" className="sd-text-button" onClick={() => setAddressReload((value) => value + 1)}>Retry addresses</button></div> : addresses.length ? <><label htmlFor="sd-address" className="sd-sr-only">Service address</label><select id="sd-address" value={selectedAddressId} onChange={(event) => setSelectedAddressId(event.target.value)} required>{addresses.map((address) => <option value={String(address.id)} key={address.id}>{address.addressType || "Address"} — {address.city || address.addressLine1 || "Saved address"}</option>)}</select><p className="sd-address-preview">{addressText(selectedAddress)}</p></> : <div className="sd-address-empty"><p>Where should we visit?</p><Link to="/account/addresses">Add your first address ↗</Link></div>}
              <label htmlFor="sd-notes" className="sd-notes-label">Anything we should know? <span>Optional</span></label><textarea id="sd-notes" name="notes" rows={2} maxLength={1000} value={form.notes} onChange={change} placeholder="Access instructions or a special request…" />
              <div className="sd-card-actions"><button type="submit" className="sd-button sd-button--primary" disabled={addressLoading || !selectedAddress}>{busy === "booking" ? "Creating booking…" : "Book this service"}<span aria-hidden="true">↗</span></button><button type="button" className="sd-button sd-button--outline" onClick={addToCart}>{busy === "cart" ? "Adding…" : "＋ Add to cart"}</button></div>
            </fieldset>
          </form>}
          <Notice notice={notice} />
          {user && <div className="sd-account-links"><Link to="/cart">View cart</Link><span aria-hidden="true">·</span><Link to="/my-bookings">My bookings</Link></div>}
                  </Motion.section></aside>
      </div>
      <div className="sd-closing"><span aria-hidden="true" /><p>Need something else done?<br /><em>Browse every service.</em></p><Link to="/services">Explore more services ↗</Link></div>
    </div>
    <div className="sd-mobile-bar"><div><small>Service price</small><strong>{money(service.price)}</strong></div><button type="button" className="sd-button sd-button--primary" onClick={focusBooking}>Choose appointment ↗</button></div>
    <dialog className="sd-lightbox" ref={dialogRef} aria-label="Full-size service photo" onClose={() => galleryButtonRef.current?.focus()} onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }} onKeyDown={(event) => { if (event.key === "ArrowRight") setActiveImage((value) => (value + 1) % Math.max(images.length, 1)); if (event.key === "ArrowLeft") setActiveImage((value) => (value - 1 + images.length) % Math.max(images.length, 1)); }}>
      <div className="sd-lightbox-top"><span>{service.title} · {activeImage + 1} / {images.length}</span><button type="button" autoFocus aria-label="Close photo viewer" onClick={() => dialogRef.current?.close()}>✕</button></div><div className="sd-lightbox-image"><ServiceImage key={images[activeImage]} src={images[activeImage]} alt={`${service.title}, photo ${activeImage + 1}`} /></div>{images.length > 1 && <div className="sd-lightbox-controls"><button type="button" onClick={() => setActiveImage((value) => (value - 1 + images.length) % images.length)}>← Previous</button><button type="button" onClick={() => setActiveImage((value) => (value + 1) % images.length)}>Next →</button></div>}
    </dialog>
  </main>;
}

