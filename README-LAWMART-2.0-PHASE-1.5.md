# LawMart 2.0 Phase 1.5

This release fixes the homepage hero at the structural source:
- explicitly resets the legacy `.hero-grid { padding: 90px 0; gap: 80px; }` inherited from `styles.css`
- removes the redundant announcement strip
- replaces the prior hero artwork with a new coherent LawMart representative illustration
- removes fixed hero minimum heights so the section is content-driven
- cache-busts `home-v2.css`

All existing forms, analytics, service pages, CNAME, and Imigracao Brasileira content are preserved.
