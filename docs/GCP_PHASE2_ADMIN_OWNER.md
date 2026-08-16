# GCP Deployment Phase 2 — Admin & Owner Apps
*Instruksi eksekusi untuk Gemini. Ikuti berurutan tanpa skip.*

---

## Konteks & State Saat Ini

Fase 1 (Customer app) sudah selesai dan berjalan di:
- **Service**: `taj-customer` di Cloud Run `asia-southeast2`
- **URL Staging**: `https://taj-customer-rm3i6swwoq-et.a.run.app`
- **CI/CD**: Trigger `deploy-customer-on-main` aktif — push ke `main` = auto deploy

**Fase 2 ini** menambahkan 2 service baru:
- `taj-admin` → dari `apps/admin/`
- `taj-owner` → dari `apps/owner/`

---

## Perbedaan Admin & Owner vs Customer

| Aspek | Customer | Admin | Owner |
|---|---|---|---|
| Port lokal | 3000 | 3001 | 3002 |
| Port Cloud Run | 8080 | 8080 | 8080 |
| Ably | ✅ | ✅ | ❌ |
| Gemini AI | ✅ | ❌ | ❌ |
| NEXT_PUBLIC_TENANT_SLUG | ✅ | ❌ | ❌ |
| Sentry project | `taj-saas-customer` | `taj-saas-admin` | `taj-saas-owner` |
| BETTER_AUTH_URL | URL customer app sendiri | URL admin app sendiri | URL owner app sendiri |

> **Penting**: `BETTER_AUTH_URL` harus diisi URL app itu sendiri karena setiap Next.js app punya route `/api/auth/[...better-auth]` masing-masing.

---

## Pra-syarat — Verifikasi Sebelum Mulai

Jalankan di Cloud Shell:
```bash
# Pastikan project benar
gcloud config get-value project
# Harus output: tajsaas-staging

# Pastikan customer masih running
gcloud run services list --region=asia-southeast2 --format="table(name,status.url)"
```

---

## BAGIAN A — Deploy Admin App

### A1 — Buat Secrets Baru untuk Admin

```bash
# URL admin app — isi placeholder, update setelah deploy pertama
echo -n "https://placeholder-admin.run.app" | gcloud secrets create TAJ_ADMIN_BETTER_AUTH_URL --data-file=-

# BETTER_AUTH_API_KEY — ambil dari .env lokal (key: BETTER_AUTH_API_KEY)
# Format: ba_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
echo -n "ba_XXXXXX_isi_dari_env_lokal" | gcloud secrets create TAJ_BETTER_AUTH_API_KEY --data-file=-
```

Verifikasi total secrets (harus 13):
```bash
gcloud secrets list --format="table(name)" | sort
```

Harus ada semua ini:
```
TAJ_ABLY_API_KEY
TAJ_ADMIN_BETTER_AUTH_URL
TAJ_BETTER_AUTH_API_KEY
TAJ_BETTER_AUTH_SECRET
TAJ_BETTER_AUTH_URL
TAJ_COOKIE_DOMAIN
TAJ_DATABASE_URL
TAJ_GEMINI_API_KEY
TAJ_OWNER_APP_URL
TAJ_POSTHOG_KEY
TAJ_SENTRY_AUTH_TOKEN
TAJ_SENTRY_DSN
TAJ_TENANT_SLUG
```

---

### A2 — Buat File `cloudbuild-admin.yaml` di Root Repo

Gemini membuat file baru `d:\taj_saas\cloudbuild-admin.yaml`:

```yaml
# cloudbuild-admin.yaml
# CI/CD pipeline untuk Admin app
# Trigger: push ke branch main

substitutions:
  _APP: admin
  _IMAGE: admin-app
  _SERVICE: taj-admin
  _REGION: asia-southeast2
  _REPOSITORY: taj-saas

steps:
  # Step 1: Build Docker image
  # NEXT_PUBLIC_* vars di-pass sebagai --build-arg (baked ke JS bundle)
  - name: "gcr.io/cloud-builders/docker"
    id: "build-image"
    secretEnv:
      - 'NEXT_PUBLIC_BETTER_AUTH_URL'
      - 'NEXT_PUBLIC_SENTRY_DSN'
      - 'NEXT_PUBLIC_POSTHOG_KEY'
    args:
      - "build"
      - "--build-arg"
      - "APP=${_APP}"
      - "--build-arg"
      - "NEXT_PUBLIC_BETTER_AUTH_URL=$$NEXT_PUBLIC_BETTER_AUTH_URL"
      - "--build-arg"
      - "NEXT_PUBLIC_SENTRY_DSN=$$NEXT_PUBLIC_SENTRY_DSN"
      - "--build-arg"
      - "NEXT_PUBLIC_POSTHOG_KEY=$$NEXT_PUBLIC_POSTHOG_KEY"
      - "-t"
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/${_IMAGE}:$BUILD_ID"
      - "-t"
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/${_IMAGE}:latest"
      - "."

  # Step 2: Push image ke Artifact Registry
  - name: "gcr.io/cloud-builders/docker"
    id: "push-image"
    args:
      - "push"
      - "--all-tags"
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/${_IMAGE}"

  # Step 3: Deploy ke Cloud Run
  # Server-side secrets di-inject via --set-secrets (runtime)
  # NEXT_PUBLIC_* tidak ada di sini — sudah baked ke image di Step 1
  - name: "gcr.io/google.com/cloudsdktool/cloud-sdk"
    id: "deploy-cloud-run"
    entrypoint: "gcloud"
    args:
      - "run"
      - "deploy"
      - "${_SERVICE}"
      - "--image=${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/${_IMAGE}:$BUILD_ID"
      - "--region=${_REGION}"
      - "--platform=managed"
      - "--port=8080"
      - "--memory=512Mi"
      - "--cpu=1"
      - "--min-instances=0"
      - "--max-instances=10"
      - "--concurrency=80"
      - "--timeout=60s"
      - "--allow-unauthenticated"
      - "--set-secrets=DATABASE_URL=TAJ_DATABASE_URL:latest,BETTER_AUTH_SECRET=TAJ_BETTER_AUTH_SECRET:latest,BETTER_AUTH_URL=TAJ_ADMIN_BETTER_AUTH_URL:latest,BETTER_AUTH_API_KEY=TAJ_BETTER_AUTH_API_KEY:latest,ABLY_API_KEY=TAJ_ABLY_API_KEY:latest,SENTRY_AUTH_TOKEN=TAJ_SENTRY_AUTH_TOKEN:latest,COOKIE_DOMAIN=TAJ_COOKIE_DOMAIN:latest,OWNER_APP_URL=TAJ_OWNER_APP_URL:latest"
      - "--set-env-vars=NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com,NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1"

# NEXT_PUBLIC_* dari Secret Manager → di-expose ke step build-image sebagai env var
availableSecrets:
  secretManager:
    - versionName: projects/$PROJECT_ID/secrets/TAJ_ADMIN_BETTER_AUTH_URL/versions/latest
      env: 'NEXT_PUBLIC_BETTER_AUTH_URL'
    - versionName: projects/$PROJECT_ID/secrets/TAJ_SENTRY_DSN/versions/latest
      env: 'NEXT_PUBLIC_SENTRY_DSN'
    - versionName: projects/$PROJECT_ID/secrets/TAJ_POSTHOG_KEY/versions/latest
      env: 'NEXT_PUBLIC_POSTHOG_KEY'

options:
  logging: CLOUD_LOGGING_ONLY

timeout: "1800s"
```

---

### A3 — Commit & Bootstrap Deploy Admin

Setelah file `cloudbuild-admin.yaml` dibuat, commit di repo lokal:

```bash
git checkout main
git add cloudbuild-admin.yaml
git commit -m "feat(gcp): add Cloud Run pipeline for admin app"
git push origin main
```

Lalu bootstrap deploy manual di Cloud Shell:
```bash
cd ~/taj_saas
git pull origin main

gcloud builds submit \
  --config=cloudbuild-admin.yaml \
  --substitutions=_APP=admin,_IMAGE=admin-app,_SERVICE=taj-admin \
  .
```

> ⏱️ Proses ~10-15 menit. Monitor di:
> `https://console.cloud.google.com/cloud-build/builds?project=tajsaas-staging`

---

### A4 — Dapatkan URL Admin & Update Secret

Setelah build STATUS: SUCCESS:

```bash
# Dapatkan URL admin
ADMIN_URL=$(gcloud run services describe taj-admin \
  --region=asia-southeast2 \
  --format="value(status.url)")
echo "Admin URL: $ADMIN_URL"

# Update secret dengan URL aktual
echo -n "$ADMIN_URL" | gcloud secrets versions add TAJ_ADMIN_BETTER_AUTH_URL --data-file=-

# Verifikasi
gcloud secrets versions access latest --secret=TAJ_ADMIN_BETTER_AUTH_URL
```

Setelah update secret, **trigger rebuild admin** agar NEXT_PUBLIC_BETTER_AUTH_URL ter-bake dengan URL yang benar:

```bash
gcloud builds submit \
  --config=cloudbuild-admin.yaml \
  --substitutions=_APP=admin,_IMAGE=admin-app,_SERVICE=taj-admin \
  .
```

---

### A5 — Buat CI/CD Trigger untuk Admin di GCP Console

Buka: `https://console.cloud.google.com/cloud-build/triggers?project=tajsaas-staging`

Klik **"Create Trigger"**, isi:
| Field | Nilai |
|---|---|
| Name | `deploy-admin-on-main` |
| Event | `Push to a branch` |
| Branch | `^main$` |
| Configuration | `Cloud Build configuration file` ← bukan Autodetected |
| Cloud Build config file location | `cloudbuild-admin.yaml` |

> Gunakan "Cloud Build configuration file" eksplisit karena kini ada 3 file cloudbuild di repo.

---

## BAGIAN B — Deploy Owner App

### B1 — Buat Secrets Baru untuk Owner

```bash
# URL owner app — placeholder dulu
echo -n "https://placeholder-owner-actual.run.app" | gcloud secrets create TAJ_OWNER_BETTER_AUTH_URL --data-file=-
```

Total secrets sekarang harus 14.

---

### B2 — Buat File `cloudbuild-owner.yaml` di Root Repo

Gemini membuat file baru `d:\taj_saas\cloudbuild-owner.yaml`:

```yaml
# cloudbuild-owner.yaml
# CI/CD pipeline untuk Owner app
# Trigger: push ke branch main
# Owner tidak pakai Ably dan tidak pakai Gemini AI

substitutions:
  _APP: owner
  _IMAGE: owner-app
  _SERVICE: taj-owner
  _REGION: asia-southeast2
  _REPOSITORY: taj-saas

steps:
  # Step 1: Build Docker image
  - name: "gcr.io/cloud-builders/docker"
    id: "build-image"
    secretEnv:
      - 'NEXT_PUBLIC_BETTER_AUTH_URL'
      - 'NEXT_PUBLIC_SENTRY_DSN'
      - 'NEXT_PUBLIC_POSTHOG_KEY'
    args:
      - "build"
      - "--build-arg"
      - "APP=${_APP}"
      - "--build-arg"
      - "NEXT_PUBLIC_BETTER_AUTH_URL=$$NEXT_PUBLIC_BETTER_AUTH_URL"
      - "--build-arg"
      - "NEXT_PUBLIC_SENTRY_DSN=$$NEXT_PUBLIC_SENTRY_DSN"
      - "--build-arg"
      - "NEXT_PUBLIC_POSTHOG_KEY=$$NEXT_PUBLIC_POSTHOG_KEY"
      - "-t"
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/${_IMAGE}:$BUILD_ID"
      - "-t"
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/${_IMAGE}:latest"
      - "."

  # Step 2: Push image ke Artifact Registry
  - name: "gcr.io/cloud-builders/docker"
    id: "push-image"
    args:
      - "push"
      - "--all-tags"
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/${_IMAGE}"

  # Step 3: Deploy ke Cloud Run
  # Owner tidak pakai: Ably, Gemini, TENANT_SLUG
  - name: "gcr.io/google.com/cloudsdktool/cloud-sdk"
    id: "deploy-cloud-run"
    entrypoint: "gcloud"
    args:
      - "run"
      - "deploy"
      - "${_SERVICE}"
      - "--image=${_REGION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/${_IMAGE}:$BUILD_ID"
      - "--region=${_REGION}"
      - "--platform=managed"
      - "--port=8080"
      - "--memory=512Mi"
      - "--cpu=1"
      - "--min-instances=0"
      - "--max-instances=10"
      - "--concurrency=80"
      - "--timeout=60s"
      - "--allow-unauthenticated"
      - "--set-secrets=DATABASE_URL=TAJ_DATABASE_URL:latest,BETTER_AUTH_SECRET=TAJ_BETTER_AUTH_SECRET:latest,BETTER_AUTH_URL=TAJ_OWNER_BETTER_AUTH_URL:latest,BETTER_AUTH_API_KEY=TAJ_BETTER_AUTH_API_KEY:latest,SENTRY_AUTH_TOKEN=TAJ_SENTRY_AUTH_TOKEN:latest,COOKIE_DOMAIN=TAJ_COOKIE_DOMAIN:latest"
      - "--set-env-vars=NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com,NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1"

availableSecrets:
  secretManager:
    - versionName: projects/$PROJECT_ID/secrets/TAJ_OWNER_BETTER_AUTH_URL/versions/latest
      env: 'NEXT_PUBLIC_BETTER_AUTH_URL'
    - versionName: projects/$PROJECT_ID/secrets/TAJ_SENTRY_DSN/versions/latest
      env: 'NEXT_PUBLIC_SENTRY_DSN'
    - versionName: projects/$PROJECT_ID/secrets/TAJ_POSTHOG_KEY/versions/latest
      env: 'NEXT_PUBLIC_POSTHOG_KEY'

options:
  logging: CLOUD_LOGGING_ONLY

timeout: "1800s"
```

---

### B3 — Commit & Bootstrap Deploy Owner

```bash
git add cloudbuild-owner.yaml
git commit -m "feat(gcp): add Cloud Run pipeline for owner app"
git push origin main
```

Bootstrap deploy di Cloud Shell:
```bash
cd ~/taj_saas
git pull origin main

gcloud builds submit \
  --config=cloudbuild-owner.yaml \
  --substitutions=_APP=owner,_IMAGE=owner-app,_SERVICE=taj-owner \
  .
```

---

### B4 — Dapatkan URL Owner & Update Semua Secrets Terkait

Setelah build SUCCESS:

```bash
OWNER_URL=$(gcloud run services describe taj-owner \
  --region=asia-southeast2 \
  --format="value(status.url)")
echo "Owner URL: $OWNER_URL"

# Update BETTER_AUTH_URL untuk owner app itu sendiri
echo -n "$OWNER_URL" | gcloud secrets versions add TAJ_OWNER_BETTER_AUTH_URL --data-file=-

# Update TAJ_OWNER_APP_URL — PENTING: dipakai customer & admin untuk redirect register
# Setelah ini customer dan admin otomatis redirect ke URL owner yang benar
echo -n "$OWNER_URL" | gcloud secrets versions add TAJ_OWNER_APP_URL --data-file=-
```

Rebuild owner agar NEXT_PUBLIC_BETTER_AUTH_URL ter-bake dengan URL benar:
```bash
gcloud builds submit \
  --config=cloudbuild-owner.yaml \
  --substitutions=_APP=owner,_IMAGE=owner-app,_SERVICE=taj-owner \
  .
```

---

### B5 — Buat CI/CD Trigger untuk Owner di GCP Console

Klik **"Create Trigger"**, isi:
| Field | Nilai |
|---|---|
| Name | `deploy-owner-on-main` |
| Event | `Push to a branch` |
| Branch | `^main$` |
| Configuration | `Cloud Build configuration file` |
| Cloud Build config file location | `cloudbuild-owner.yaml` |

---

## BAGIAN C — Verifikasi Akhir

### C1 — Cek Semua 3 Services Running di Cloud Shell

```bash
gcloud run services list \
  --region=asia-southeast2 \
  --format="table(name,status.url)"
```

Harus muncul:
```
NAME          URL
taj-customer  https://taj-customer-rm3i6swwoq-et.a.run.app
taj-admin     https://taj-admin-XXXXX-as.a.run.app
taj-owner     https://taj-owner-XXXXX-as.a.run.app
```

### C2 — Cek Semua 3 Triggers Active

```bash
gcloud builds triggers list --region=global \
  --format="table(name,filename)"
```

Harus ada:
```
deploy-customer-on-main   cloudbuild.yaml
deploy-admin-on-main      cloudbuild-admin.yaml
deploy-owner-on-main      cloudbuild-owner.yaml
```

### C3 — Test Fungsional Manual

Buka setiap URL di browser dan verifikasi:

| Test | Customer | Admin | Owner |
|---|---|---|---|
| Homepage load (HTTP 200) | ✅ | ✅ | ✅ |
| Tidak ada error 500 | ✅ | ✅ | ✅ |
| Login/auth flow berfungsi | N/A (no login) | ✅ | ✅ |
| Redirect ke owner /register saat tenant 404 | ✅ | ✅ | N/A |

---

## Batasan yang Tidak Boleh Dilanggar Gemini

1. **Jangan ubah `Dockerfile`** — sudah support semua 3 app via `APP` build arg
2. **Jangan ubah `cloudbuild.yaml`** (customer) — hanya tambah file baru
3. **Jangan hardcode secrets** di file cloudbuild manapun
4. **Jangan pakai `--set-secrets` untuk NEXT_PUBLIC_* vars** — wajib via `availableSecrets` + `--build-arg`
5. **Deploy admin dulu, baru owner** — `TAJ_OWNER_APP_URL` dibutuhkan oleh admin saat deploy
6. **Update `TAJ_OWNER_APP_URL` setelah owner URL diketahui** — customer & admin bergantung pada secret ini untuk redirect `/register`
7. **Semua secrets harus punya minimal 1 versi** sebelum build — gunakan `"none"` jika belum ada nilai

---

## Referensi Infrastruktur

| Item | Nilai |
|---|---|
| Customer URL | `https://taj-customer-rm3i6swwoq-et.a.run.app` |
| GCP Project | `tajsaas-staging` |
| Project Number | `831438585979` |
| Region | `asia-southeast2` |
| Artifact Registry | `asia-southeast2-docker.pkg.dev/tajsaas-staging/taj-saas` |
| Cloud Build Console | `https://console.cloud.google.com/cloud-build/builds?project=tajsaas-staging` |
| Compute SA | `831438585979-compute@developer.gserviceaccount.com` |
