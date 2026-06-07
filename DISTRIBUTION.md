# 💸 OmniTrain AI: Commercial Distribution Guide

This guide explains how to take the built binaries from your GitHub repository and sell them on your website.

## 1. Generating the Binaries
OmniTrain is configured with **GitHub Actions**. To create a new set of installers for your website:
1. Push a new version tag to GitHub:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
2. Wait for the "Release" Action to finish (usually 10-15 minutes).
3. Go to your GitHub repository's **Releases** tab.
4. You will see three main files:
   - `OmniTrain_AI_Setup_1.0.0.exe` (Windows Installer)
   - `OmniTrain_AI_1.0.0.dmg` (Mac Installer)
   - `OmniTrain_AI_1.0.0.AppImage` (Linux Portable)

## 2. Preparing for Your Website
When selling the product, you should provide these files behind a payment wall (like Stripe, Gumroad, or LemonSqueezy).

### Recommended Download Structure:
- **Windows User:** Provide the `.exe` file.
- **Mac User:** Provide the `.dmg` file.
- **Linux User:** Provide the `.AppImage`.

## 3. License & Branding
The software is set to **Commercial License**.
- The **Settings > License** tab allows users to enter a key.
- *Pro Tip:* To fully lock the app, you will need to integrate a licensing API (like Keygen.sh or Cryptolens) into the `backend/main.py` license endpoint.

## 4. Updates
When you want to release a new version (e.g., v1.1.0):
1. Update `"version": "1.1.0"` in `package.json`.
2. Push the code and a new tag `v1.1.0`.
3. Upload the new files to your website.

---
*Commercial Distribution Ready.*
