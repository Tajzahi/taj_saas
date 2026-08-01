# Dokumentasi Perencanaan ERP FnB Enterprise

Dokumentasi ini menyatukan seluruh pembahasan menjadi satu blueprint profesional sebelum build untuk produk **ERP FnB multi-outlet kelas enterprise** dengan 3 portal web:

1. **Customer Web** — online ordering/QR ordering seperti e-commerce khusus FnB.
2. **Karyawan Web** — POS + dapur + operasional outlet dalam satu PWA.
3. **Owner/Admin Web** — ERP/backoffice lengkap untuk owner, admin pusat, manager, finance, inventory, purchasing, dan reporting.

Prinsip arsitektur utama:

- **3 frontend/portal, 1 backend ERP core, 1 database utama.**
- **Web App/PWA first**, bukan native app di awal.
- **Modular monolith enterprise-ready**, bukan microservices dari awal.
- **PostgreSQL sebagai database utama** karena ERP membutuhkan konsistensi transaksi dan relasi data kuat.
- Semua modul dalam dokumen ini adalah **target scope utuh**, bukan MVP. Implementasi boleh bertahap secara teknis, tetapi seluruh scope tetap dianggap bagian dari baseline produk final.

## Daftar Dokumen

| No | File | Isi |
|---:|---|---|
| 01 | `01_master_blueprint.md` | Ringkasan utuh produk, visi, scope, prinsip, dan target enterprise |
| 02 | `02_enterprise_scope_modules.md` | Peta modul lengkap per portal dan domain bisnis |
| 03 | `03_functional_requirements.md` | Functional requirements detail per modul |
| 04 | `04_architecture_tech_stack.md` | Arsitektur, stack, standar engineering, migrasi skala |
| 05 | `05_data_model.md` | Model data high-level dan data dictionary inti |
| 06 | `06_rbac_workflows.md` | Role, permission, approval, workflow bisnis utama |
| 07 | `07_ui_ux_sitemap.md` | Sitemap, screen list, dan UX notes untuk 3 portal |
| 08 | `08_api_devops_security_qa.md` | API overview, DevOps, security, audit, QA strategy |
| 09 | `09_delivery_acceptance_plan.md` | Rencana delivery enterprise full-scope, DoD, acceptance criteria |
| 10 | `10_prebuild_checklist.md` | Checklist dokumen dan keputusan sebelum build |

## Appendix

| File | Isi |
|---|---|
| `appendix/module-feature-matrix.csv` | Matrix fitur per portal |
| `appendix/rbac-matrix.csv` | RBAC matrix ringkas |
| `appendix/initial-backlog.csv` | Backlog awal full-scope |
| `appendix/erd-high-level.mmd` | ERD high-level Mermaid |
| `appendix/workflows.mmd` | Workflow Mermaid |
| `appendix/openapi-starter.yaml` | Starter OpenAPI contract |

## Cara Menggunakan

1. Review `01` dan `02` untuk menyamakan visi dan scope utuh.
2. Review `03` untuk validasi kebutuhan fitur.
3. Review `04` dan `05` untuk validasi arsitektur dan data.
4. Review `06` sampai `08` untuk operasional, UX, security, API, dan QA.
5. Gunakan `09` dan `10` sebagai gate sebelum build dimulai.
