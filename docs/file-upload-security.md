# File Storage & Upload Security Specification — TMS

## 1. Core Principles

Files in TMS (task attachments, chat documents, design proofs) frequently contain confidential company data. The file storage architecture adheres to the following rules:

1. **Private by Default**: Storage buckets are strictly private. No public asset URLs are generated for company documents.
2. **Never Trust Client Content-Type**: MIME types and file extensions reported by the browser are validated server-side.
3. **Signed URLs with Ephemeral Lifespans**: All file downloads require time-limited signed URLs (e.g. 15-minute expiry) issued only after verifying the user's organization membership.
4. **Execution Prevention**: Files are served with `Content-Disposition: attachment; filename="safe_name.ext"` and `X-Content-Type-Options: nosniff` to prevent browsers from executing uploaded HTML, SVG, or JavaScript.

---

## 2. Validation & Upload Pipeline

```
[ Client File Selection ]
           |
           v
[ Pre-Upload Validation (Client-Side) ]
  - Verify size < 10MB
  - Whitelist extension (.pdf, .png, .jpg, .docx, .xlsx, .csv, .zip)
           |
           v
[ Server Request for Signed Upload URL ]
  - Verify user authenticated & belongs to target organization_id
  - Generate cryptographically secure UUID filename (e.g. org_id/project_id/{uuid}.ext)
  - Issue ephemeral presigned PUT URL
           |
           v
[ Direct Upload to Supabase Storage (Private Bucket) ]
           |
           v
[ Post-Upload Verification Hook ]
  - Validate file magic bytes (magic number check for true file format)
  - Reject polyglot files or executable signatures
  - Store metadata in database (original_name, mime_type, byte_size, uploaded_by)
```

---

## 3. Allowed File Formats & Restrictions

| Category | Allowed Extensions | Max Size | Serving Headers |
| :--- | :--- | :---: | :--- |
| **Documents** | `.pdf`, `.docx`, `.xlsx`, `.pptx`, `.csv`, `.txt` | 10 MB | `Content-Disposition: attachment` |
| **Images** | `.png`, `.jpg`, `.jpeg`, `.webp` | 5 MB | Image preview rendered with stripped EXIF data |
| **Archives** | `.zip` | 10 MB | `Content-Disposition: attachment` |
| **Prohibited** | `.exe`, `.bat`, `.sh`, `.cmd`, `.svg`, `.html`, `.htm`, `.js`, `.vbs`, `.php` | **0 MB (Rejected)** | Immediate 400 Bad Request |

> **Note on SVGs**: SVG files can contain embedded `<script>` tags and XML External Entity (XXE) vectors. TMS strictly disallows raw user SVG uploads for general attachments. User avatars only accept raster formats (`.png`, `.jpg`, `.webp`).

---

## 4. Download Authorization Flow

```
[ User Requests Download: /api/files/{file_id}/download ]
                      |
                      v
[ Server Route Handler ]
  1. Authenticate user session.
  2. Query database for file record:
     SELECT organization_id, storage_path FROM attachments WHERE id = file_id;
  3. Validate caller is an active member of organization_id via RLS.
  4. If unauthorized -> return 403 Forbidden.
  5. If authorized -> generate Supabase Storage signed URL (expires in 600s).
  6. Redirect user or return signed URL.
```
