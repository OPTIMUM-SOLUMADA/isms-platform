# 💾 Render Persistent Disk Configuration

## 📋 Overview

This application has been configured to use Render's persistent disk for file storage, ensuring uploaded documents survive container restarts and deployments.

## 🔄 What Changed

### Backend Changes

#### 1. **Environment Configuration** (`server/src/configs/env.ts`)
- Added `STORAGE_PATH` environment variable
- Allows configuring storage location (Render persistent disk or local development)

#### 2. **Upload Configuration** (`server/src/configs/upload.ts`)
- Updated to use configurable `STORAGE_PATH` from environment
- **Render**: Uses `/var/data/uploads` when `STORAGE_PATH=/var/data`
- **Local Dev**: Uses `./uploads` when `STORAGE_PATH` is not set

#### 3. **Storage Initialization** (`server/src/init/storage.init.ts`) - NEW FILE
- Creates required directories at application startup
- Verifies write permissions
- Logs storage configuration for debugging
- Prevents runtime errors from missing directories

#### 4. **Data Initialization** (`server/src/init/data.init.ts`)
- Now calls `initializeStorageDirectories()` at startup
- Ensures storage is ready before processing uploads

#### 5. **Multer Configuration** (`server/src/configs/multer/document-multer.ts`)
- Simplified: removed redundant directory creation
- Relies on startup initialization for better performance

### No Changes Required

✅ **Existing services remain unchanged:**
- Document service
- Google Drive service
- File service
- All routes and controllers

✅ **Existing functionality preserved:**
- File upload endpoints
- File download endpoints
- Static file serving
- Google Drive integration

## 🚀 Render Setup Instructions

### Step 1: Create Persistent Disk in Render

1. **Go to Render Dashboard** → Your Service → Disks
2. **Click "Add Disk"**
   - **Name**: `isms-storage` (or your preferred name)
   - **Mount Path**: `/var/data`
   - **Size**: Start with 1GB, increase as needed
3. **Save** and wait for provisioning

### Step 2: Configure Environment Variable

1. **Go to Render Dashboard** → Your Service → Environment
2. **Add environment variable:**
   ```bash
   STORAGE_PATH=/var/data
   ```
3. **Save Changes**

### Step 3: Deploy

Render will automatically:
- Redeploy your service
- Mount the persistent disk at `/var/data`
- Create required directories on startup
- Start accepting file uploads

## 📁 Directory Structure

### Production (Render with Persistent Disk)
```
/var/data/                    # Persistent disk mount point
  └── uploads/                # Main uploads directory
      └── documents/          # Document files
```

### Local Development
```
project-root/
  └── uploads/                # Local uploads directory
      └── documents/          # Document files
```

## 🔍 Verification

### Check Storage Configuration

After deployment, check the Render logs for these messages:

```
[storage-init] Initializing storage directories...
[storage-init] Using persistent storage at: /var/data
[storage-init] Upload path: /var/data/uploads
[storage-init] ✓ Created uploads directory: /var/data/uploads
[storage-init] ✓ Created documents directory: /var/data/uploads/documents
[storage-init] ✓ Write permissions verified
[storage-init] Storage initialization complete!
```

### Test File Upload

1. **Upload a document** via the application
2. **Check Render Shell** (Dashboard → Shell):
   ```bash
   ls -la /var/data/uploads/documents/
   ```
3. **Restart service** and verify files persist

## 🧪 Testing Checklist

### Local Development (No STORAGE_PATH)
- [ ] Application starts successfully
- [ ] Files upload to `./uploads/documents/`
- [ ] Files can be downloaded
- [ ] File previews work
- [ ] No errors in console

### Render Production (STORAGE_PATH=/var/data)
- [ ] Application starts successfully
- [ ] Storage initialization logs appear
- [ ] Files upload successfully
- [ ] Files persist after container restart
- [ ] Files persist after redeployment
- [ ] Download and preview work correctly

## 🔧 Configuration Reference

### Environment Variables

| Variable | Local Dev | Render Production | Description |
|----------|-----------|-------------------|-------------|
| `STORAGE_PATH` | *(not set)* | `/var/data` | Base path for file storage |
| Upload Path | `./uploads` | `/var/data/uploads` | Actual uploads directory |
| Documents Path | `./uploads/documents` | `/var/data/uploads/documents` | Document files |

### Disk Settings (Render)

| Setting | Recommended Value | Notes |
|---------|------------------|-------|
| **Mount Path** | `/var/data` | Must match STORAGE_PATH |
| **Initial Size** | 1 GB | Increase based on usage |
| **Type** | SSD | Better performance |

## 🐛 Troubleshooting

### Problem: "Cannot write to storage directory"

**Cause:** Missing write permissions or disk not mounted

**Solution:**
1. Verify disk is properly mounted in Render dashboard
2. Check `STORAGE_PATH` environment variable is set
3. Restart service to reinitialize

### Problem: Files disappear after restart

**Cause:** Files stored in ephemeral container storage

**Solution:**
1. Ensure `STORAGE_PATH=/var/data` is set
2. Verify persistent disk is mounted at `/var/data`
3. Check startup logs confirm persistent storage is used

### Problem: "Directory does not exist" errors

**Cause:** Storage initialization failed

**Solution:**
1. Check application logs for initialization errors
2. Verify disk has sufficient space
3. Ensure proper permissions on mount point

### Debug Commands (Render Shell)

```bash
# Check if disk is mounted
df -h | grep /var/data

# Verify directory structure
ls -la /var/data/
ls -la /var/data/uploads/
ls -la /var/data/uploads/documents/

# Check permissions
ls -ld /var/data/
ls -ld /var/data/uploads/

# Check disk usage
du -sh /var/data/*

# Test write permissions
touch /var/data/test && rm /var/data/test && echo "Write OK"
```

## 📊 Migration Guide

### Migrating Existing Files to Persistent Disk

If you have files in the old ephemeral storage, you need to re-upload them or migrate manually:

#### Option 1: Re-upload Documents
1. Download all documents from the application
2. Deploy with persistent disk configured
3. Re-upload documents through the application

#### Option 2: Manual Migration (via Render Shell)
```bash
# Copy files from old location to persistent disk
cp -r /app/uploads/* /var/data/uploads/

# Verify files copied
ls -la /var/data/uploads/documents/
```

**Note:** Since the application now uses Google Drive as primary storage, local files in `/uploads` are temporary and can be safely deleted after upload. The persistent disk mainly ensures consistency during the upload process.

## 🔒 Security Considerations

### Access Control
- ✅ Files stored on disk are accessible only within the container
- ✅ Public access controlled by Express static middleware
- ✅ Authentication required for document operations

### Backup Strategy
- ✅ Primary storage is Google Drive (cloud-based)
- ✅ Local disk storage is temporary during upload process
- ✅ Persistent disk ensures upload reliability
- ⚠️ Consider backing up persistent disk for disaster recovery

## 📈 Monitoring

### Disk Usage Monitoring

Monitor disk usage in Render dashboard:
- **Dashboard** → Your Service → Metrics → Disk Usage
- Set up alerts for when disk reaches 80% capacity

### Cleanup Strategy

Since files are primarily stored in Google Drive:
- Local files in `/uploads/documents` can be periodically cleaned
- Keep only recent uploads (e.g., last 7 days)
- Implement cleanup job if needed

## 🆘 Support

If you encounter issues:

1. **Check Logs:**
   ```bash
   render logs --tail -s your-service-name
   ```

2. **Verify Configuration:**
   - Render Dashboard → Environment Variables
   - Confirm `STORAGE_PATH=/var/data`

3. **Check Disk Status:**
   - Render Dashboard → Disks
   - Verify disk is mounted and has space

4. **Test Write Access:**
   - Use Render Shell to test permissions
   - Run verification commands above

---

**Last Updated:** February 4, 2026  
**Status:** ✅ Configured and Ready  
**Environment:** Production (Render) + Development

## 📚 Related Documentation

- [Render Persistent Disks Documentation](https://render.com/docs/disks)
- [Document Preview Fix](./DOCUMENT_PREVIEW_FIX.md)
- [Google Drive Integration](./GOOGLE_DRIVE_PREVIEW_FIX.md)
