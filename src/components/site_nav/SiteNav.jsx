import { useState } from "react";
import "./SiteNav.scss";

const LINKS = [
  { href: "#HomepageSection", label: "Trang chủ" },
  { href: "#CoupleImageSection", label: "Cặp đôi" },
  { href: "#SaveTheDateSection", label: "Thiệp mời" },
  { href: "#MapSection", label: "Địa điểm" },
  { href: "#WeddingAlbumSection", label: "Album" },
  { href: "#GuestBookSection", label: "Sổ lưu bút" },
];

const SiteNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-nav">
      <a className="site-nav-brand" href="#HomepageSection">
        Q & H
      </a>
      <button
        className="site-nav-toggle"
        type="button"
        aria-label={open ? "Đóng menu" : "Mở menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
      <nav className={open ? "site-nav-links is-open" : "site-nav-links"}>
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default SiteNav;
