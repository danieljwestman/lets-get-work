
# Translation Files - SEED DATA ONLY

⚠️ **IMPORTANT: These JSON files are SEED DATA ONLY and are NOT used at runtime.**

## Database-Only Translation System

This application uses a **database-only translation system**:

- ✅ All translations are stored in and loaded from the database
- ✅ Changes take effect immediately when published via admin interface  
- ✅ No dev/prod sync issues
- ✅ Real-time translation updates

## Purpose of These Files

These JSON files serve as:
- 📋 **Reference documentation** for developers
- 🌱 **Seed data** for initial theme setup
- 💾 **Backup/export** format for translations

## How to Manage Translations

1. **Adding/Editing**: Use the admin interface at `/dashboard` → Themes → Edit Theme → Translations
2. **Publishing**: Click "Publish All" or individual publish buttons to make changes live
3. **Backup**: Use "Export Reference" to download current database state as JSON

## File Structure

```
en.json / sv.json
├── hero
│   ├── title
│   ├── description
│   └── buttons.*
├── about.*
├── skills.*
└── ...
```

## Development Notes

- These files are NOT loaded by `useTranslations` hook
- Database translations override any content in these files
- Use admin interface to populate database with initial translations
- Export function generates reference files but doesn't update the codebase files
