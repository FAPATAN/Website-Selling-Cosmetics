import API_URL from '../config';
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    setSearchLoading(true);
    fetch(`${API_URL}/api/products/search?q=${encodeURIComponent(searchQuery)}`)
      .then(r => r.json())
      .then(d => { setSearchResults(Array.isArray(d) ? d : (d.products || [])); setSearchLoading(false); })
      .catch(() => { setSearchResults([]); setSearchLoading(false); });
  }, [searchQuery]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={searchRef} style={{ position: "relative" }}>
      <form
        className={`search-form${searchOpen ? " active-search" : ""}`}
        onSubmit={e => e.preventDefault()}
      >
        <input
          type="text"
          placeholder="ค้นหาสินค้า..."
          className="search-input"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          autoFocus={searchOpen}
          onKeyDown={e => {
            if (e.key === 'Enter' && searchResults.length > 0) {
              navigate(`/best1/${searchResults[0].Product_id}`);
              setSearchOpen(false); setSearchQuery(''); setSearchResults([]);
            }
          }}
        />
        <button
          className="search-button icon-link"
          type="button"
          onClick={() => {
            setSearchOpen(o => !o);
            if (searchOpen) { setSearchQuery(""); setSearchResults([]); }
          }}
        >
          {searchOpen
            ? <i className="fa-solid fa-xmark" style={{ fontSize: 18, color: "#333" }}></i>
            : (
              <svg className="search-icon svg-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            )
          }
        </button>
      </form>

      {searchOpen && searchQuery.trim() && (
        <div style={{ position: "absolute", top: "62px", right: 0, width: "320px", background: "#fff", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.13)", zIndex: 9999, maxHeight: "360px", overflowY: "auto", padding: "8px 0" }}>
          {searchLoading && (
            <div style={{ padding: "16px", textAlign: "center", color: "#999", fontSize: 14 }}>กำลังค้นหา...</div>
          )}
          {!searchLoading && searchResults.length === 0 && (
            <div style={{ padding: "16px", textAlign: "center", color: "#999", fontSize: 14 }}>ไม่พบสินค้า</div>
          )}
          {!searchLoading && searchResults.map(p => (
            <div
              key={p.Product_id}
              onClick={() => { navigate(`/best1/${p.Product_id}`); setSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
              style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", cursor: "pointer", transition: "background .15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <img
                src={p.Product_image ? `${API_URL}/uploads/${p.Product_image}` : "/placeholder.png"}
                alt={p.Product_name}
                style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, flexShrink: 0, border: "1px solid #eee" }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: "#222", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.Product_name}</div>
                <div style={{ fontSize: 12.5, color: "#e05c8a", marginTop: 2 }}>฿{Number(p.Product_price).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
