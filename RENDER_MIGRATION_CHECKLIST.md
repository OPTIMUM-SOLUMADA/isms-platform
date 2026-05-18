# 🚀 Render Persistent Disk Migration Checklist

This checklist helps you deploy the updated file storage configuration to Render.

## ✅ Pre-Deployment Checklist

- [ ] **Review Changes**
  - [ ] Read [RENDER_PERSISTENT_DISK_SETUP.md](./RENDER_PERSISTENT_DISK_SETUP.md)
  - [ ] Understand the storage path configuration
  - [ ] Review modified files

- [ ] **Local Testing**
  - [ ] Start server locally (without STORAGE_PATH set)
  - [ ] Verify uploads directory is created in `./uploads`
  - [ ] Test document upload functionality
  - [ ] Verify files are saved correctly
  - [ ] Test document download and preview
  - [ ] Check logs show storage initialization

## 📦 Render Setup

### Step 1: Create Persistent Disk

- [ ] Go to Render Dashboard → Your Service
- [ ] Click on **"Disks"** tab
- [ ] Click **"Add Disk"**
- [ ] Configure disk:
  ```
  Name: isms-storage
  Mount Path: /var/data
  Size: 1 GB (or more based on needs)
  ```
- [ ] Click **"Save"**
- [ ] Wait for disk provisioning (usually 1-2 minutes)

### Step 2: Configure Environment

- [ ] Go to **"Environment"** tab
- [ ] Add new environment variable:
  ```
  Key: STORAGE_PATH
  Value: /var/data
  ```
- [ ] Click **"Save Changes"**

### Step 3: Deploy

- [ ] Commit all changes to git:
  ```bash
  git add .
  git commit -m "feat: Add Render persistent disk support for file storage"
  git push origin main
  ```
- [ ] Render will auto-deploy (or manually trigger deploy)
- [ ] Monitor deployment logs

## 🔍 Post-Deployment Verification

### Check Logs

- [ ] Go to **"Logs"** tab in Render Dashboard
- [ ] Look for storage initialization messages:
  ```
  [storage-init] Initializing storage directories...
  [storage-init] Using persistent storage at: /var/data
  [storage-init] Upload path: /var/data/uploads
  [storage-init] ✓ Created uploads directory
  [storage-init] ✓ Created documents directory
  [storage-init] ✓ Write permissions verified
  [storage-init] Storage initialization complete!
  ```
- [ ] Verify no errors in logs

### Test Functionality

#### Test 1: Document Upload
- [ ] Navigate to document creation page
- [ ] Upload a PDF or DOCX file
- [ ] Verify upload succeeds
- [ ] Check document appears in list

#### Test 2: Document Preview
- [ ] Open uploaded document
- [ ] Verify preview loads correctly in iframe
- [ ] Check no 403 or 404 errors

#### Test 3: Document Download
- [ ] Click download button
- [ ] Verify file downloads successfully
- [ ] Open downloaded file to confirm it's not corrupted

#### Test 4: Persistence (Critical)
- [ ] Upload a test document
- [ ] Note the document ID
- [ ] Trigger a service restart:
  - Go to Render Dashboard → Manual Deploy → "Clear build cache & deploy"
- [ ] After restart, verify:
  - [ ] Document still appears in list
  - [ ] Preview still works
  - [ ] Download still works

### Verify Disk Usage

- [ ] Go to Render Dashboard → Your Service → **Metrics**
- [ ] Check **Disk Usage** graph
- [ ] Verify disk is being used (should show some MB used)

### Shell Verification (Optional)

- [ ] Go to Render Dashboard → Your Service → **Shell**
- [ ] Run verification commands:
  ```bash
  # Check disk is mounted
  df -h | grep /var/data
  
  # Check directories exist
  ls -la /var/data/
  ls -la /var/data/uploads/
  ls -la /var/data/uploads/documents/
  
  # Check permissions
  ls -ld /var/data/uploads/
  
  # Test write access
  touch /var/data/test && rm /var/data/test && echo "✓ Write access OK"
  ```

## 🐛 Troubleshooting

### Issue: Storage initialization fails

**Symptoms:** Logs show error creating directories

**Check:**
- [ ] Is disk properly mounted? (Check Render Dashboard → Disks)
- [ ] Is STORAGE_PATH set correctly? (Should be `/var/data`)
- [ ] Does disk have sufficient space?

**Fix:**
- Verify disk is "Active" in Render dashboard
- Ensure STORAGE_PATH=/var/data (no trailing slash)
- Restart service

### Issue: Files disappear after restart

**Symptoms:** Uploaded files missing after deployment

**Check:**
- [ ] Is STORAGE_PATH environment variable set?
- [ ] Is persistent disk mounted?
- [ ] Check logs: Are files being saved to `/var/data/uploads`?

**Fix:**
- Verify STORAGE_PATH=/var/data is set
- Check disk is mounted and active
- Re-upload test file and verify persistence

### Issue: Permission denied errors

**Symptoms:** Cannot write to storage directory

**Check:**
- [ ] Check directory permissions in Shell
- [ ] Verify disk mount point

**Fix:**
```bash
# In Render Shell
ls -ld /var/data/
# Should show: drwxr-xr-x

# If permissions are wrong, Render support can help
```

### Issue: "Cannot find module" errors

**Symptoms:** Import errors for storage.init.ts

**Fix:**
- Verify TypeScript compilation succeeded
- Check build logs for compilation errors
- Ensure all imports are correct

## 📊 Success Criteria

All of these should be ✓ before considering migration complete:

- [ ] Application starts without errors
- [ ] Storage initialization logs appear
- [ ] Files can be uploaded
- [ ] Files can be previewed
- [ ] Files can be downloaded
- [ ] Files persist after service restart
- [ ] No errors in application logs
- [ ] Disk usage is being tracked in Render metrics

## 🔄 Rollback Plan (If Needed)

If something goes wrong:

1. **Remove STORAGE_PATH environment variable**
   - Go to Render Dashboard → Environment
   - Delete STORAGE_PATH variable
   - Save changes

2. **Revert code changes**
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Service will restart and use ephemeral storage**
   - Note: Files will be lost on restart
   - Consider this a temporary measure

## 📝 Notes

- **Backward Compatibility:** Code works with or without STORAGE_PATH set
- **Local Development:** No changes needed, continues using `./uploads`
- **Google Drive:** Primary storage remains Google Drive (unchanged)
- **Persistent Disk:** Ensures files don't disappear during upload process

## 🎉 Completion

Once all checkboxes are ✓:

- [ ] Document completion date: ________________
- [ ] Verified by: ________________
- [ ] Any issues encountered: ________________

---

**Need Help?**
- Review: [RENDER_PERSISTENT_DISK_SETUP.md](./RENDER_PERSISTENT_DISK_SETUP.md)
- Check: [Render Disks Documentation](https://render.com/docs/disks)
- Contact: Render Support or development team
