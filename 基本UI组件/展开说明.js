function setExpandNoteOpen(host, open, animate) {
  if (!host) return;
  if (!open) {
    host.classList.remove("note-open");
    return;
  }
  if (!animate) {
    host.classList.add("note-open");
    return;
  }
  host.classList.remove("note-open");
  requestAnimationFrame(() => {
    host.classList.add("note-open");
  });
}
