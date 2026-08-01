# AGENTS.md — Instructions for AI Coding Agents

You are working on an ERP FnB Enterprise multi-outlet project.

## Source of Truth

Read the planning documents in this repository/folder before coding:

- README.md
- 01_master_blueprint.md
- 02_enterprise_scope_modules.md
- 03_functional_requirements.md
- 04_architecture_tech_stack.md
- 05_data_model.md
- 06_rbac_workflows.md
- 07_ui_ux_sitemap.md
- 08_api_devops_security_qa.md
- 09_delivery_acceptance_plan.md
- 10_prebuild_checklist.md
- 11_ai_build_instructions.md
- appendix/*.csv

If `.mmd` or `.yaml` files are unavailable, ignore them. They are illustrative only.

## Product Architecture

Build:

- customer-web: Customer ordering web/PWA.
- staff-web: POS + kitchen + outlet operations web/PWA.
- owner-web: ERP/backoffice web.
- api: one ERP backend API.
- PostgreSQL: one primary database.

Do not create separate backends/databases per portal.

## Recommended Stack

- Monorepo: Turborepo or Nx.
- Frontend: Next.js + React + TypeScript.
- UI: Tailwind CSS + shadcn/ui.
- Backend: NestJS + TypeScript.
- Database: PostgreSQL.
- ORM: Prisma.
- Realtime: Socket.IO.
- Queue/cache: Redis + BullMQ.
- Tests: Jest/Vitest, Supertest, Playwright.
- Deployment: Docker Compose initially.

## Engineering Rules

- Modular monolith.
- TypeScript strict mode.
- RBAC enforced in backend.
- Tenant/outlet scoping enforced in backend.
- Audit log for critical actions.
- Inventory movement must be append-only.
- Do not update stock directly without movement ledger.
- Payment callbacks must be idempotent.
- Use DTO/request validation.
- Use migrations for schema changes.
- Update TASKS.md and CHANGELOG.md after major work.

## Full Scope

This is full-scope enterprise target, not MVP. Implementation can be staged by waves, but do not remove planned enterprise modules.
