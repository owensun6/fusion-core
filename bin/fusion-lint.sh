#!/usr/bin/env bash
# fusion-lint.sh — Fusion-Core 结构性自动检查脚本（模板）
# 用法: bash bin/fusion-lint.sh <扫描目录> [--fix]
# 退出码: 0=全绿, 1=有 ERROR/CRITICAL, 2=仅 WARNING

set -euo pipefail

TARGET_DIR="${1:-.}"
FIX_MODE="${2:-}"
EXIT_CODE=0
MAX_FILE_LINES=300

echo "=== Fusion-Core Lint ==="
echo "Target: $TARGET_DIR"
echo ""

# --- L1: 密钥泄露扫描 (CRITICAL) ---
echo "--- [L1] Secret Scan ---"
SECRET_HITS=$(grep -rn \
  -e 'API_KEY\s*=' \
  -e 'SECRET_KEY\s*=' \
  -e 'PASSWORD\s*=' \
  -e 'PRIVATE_KEY\s*=' \
  -e 'sk-[a-zA-Z0-9]' \
  -e 'ghp_[a-zA-Z0-9]' \
  -e 'aws_secret_access_key' \
  "$TARGET_DIR" \
  --include='*.py' --include='*.ts' --include='*.js' --include='*.tsx' --include='*.jsx' \
  2>/dev/null || true)

if [ -n "$SECRET_HITS" ]; then
  echo "CRITICAL: Potential secrets found!"
  echo "$SECRET_HITS"
  EXIT_CODE=1
else
  echo "OK: No secrets detected"
fi
echo ""

# --- L2: Author 签名检查 (ERROR) ---
echo "--- [L2] Author Stamp ---"
MISSING_STAMPS=""
while IFS= read -r file; do
  FIRST_LINES=$(head -5 "$file" 2>/dev/null || true)
  if ! echo "$FIRST_LINES" | grep -qi 'Author:'; then
    MISSING_STAMPS="$MISSING_STAMPS\n  MISSING: $file"
    if [ "$EXIT_CODE" -lt 1 ]; then EXIT_CODE=1; fi
  fi
done < <(find "$TARGET_DIR" -type f \( -name '*.py' -o -name '*.ts' -o -name '*.js' -o -name '*.tsx' -o -name '*.jsx' -o -name '*.sql' \) \
  -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' -not -path '*/__pycache__/*' \
  -not -name '*.test.*' -not -name '*.spec.*' -not -path '*/tests/*' -not -path '*/test/*')

if [ -n "$MISSING_STAMPS" ]; then
  echo "ERROR: Files missing Author stamp:"
  echo -e "$MISSING_STAMPS"
else
  echo "OK: All production files have Author stamp"
fi
echo ""

# --- L3: 调试残留 (WARNING) ---
echo "--- [L3] Debug Residue ---"
DEBUG_HITS=$(grep -rn \
  -e 'console\.log' \
  -e 'console\.debug' \
  -e '\bprint(' \
  -e '# TODO' \
  -e '// TODO' \
  -e '# FIXME' \
  -e '// FIXME' \
  "$TARGET_DIR" \
  --include='*.py' --include='*.ts' --include='*.js' --include='*.tsx' --include='*.jsx' \
  --exclude='*.test.ts' --exclude='*.test.js' --exclude='*.test.tsx' --exclude='*.test.jsx' \
  --exclude='*.spec.ts' --exclude='*.spec.js' --exclude='*.spec.tsx' --exclude='*.spec.jsx' \
  --exclude-dir=tests --exclude-dir=test \
  2>/dev/null || true)

if [ -n "$DEBUG_HITS" ]; then
  echo "WARNING: Debug/TODO residue found:"
  echo "$DEBUG_HITS"
  if [ "$EXIT_CODE" -eq 0 ]; then EXIT_CODE=2; fi
else
  echo "OK: No debug residue"
fi
echo ""

# --- L4: 文件行数检查 (WARNING) ---
echo "--- [L4] File Size ---"
OVERSIZED=""
while IFS= read -r file; do
  LINES=$(wc -l < "$file" 2>/dev/null || echo 0)
  if [ "$LINES" -gt "$MAX_FILE_LINES" ]; then
    OVERSIZED="$OVERSIZED\n  OVERSIZED ($LINES lines): $file"
    if [ "$EXIT_CODE" -eq 0 ]; then EXIT_CODE=2; fi
  fi
done < <(find "$TARGET_DIR" -type f \( -name '*.py' -o -name '*.ts' -o -name '*.js' -o -name '*.tsx' -o -name '*.jsx' \) \
  -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*')

if [ -n "$OVERSIZED" ]; then
  echo "WARNING: Files exceeding $MAX_FILE_LINES lines:"
  echo -e "$OVERSIZED"
else
  echo "OK: All files within $MAX_FILE_LINES line limit"
fi
echo ""

# --- Summary ---
echo "=== Summary ==="
case $EXIT_CODE in
  0) echo "PASS: All checks green" ;;
  1) echo "BLOCKED: CRITICAL/ERROR found — must fix before REFACTOR" ;;
  2) echo "WARNING: Non-critical issues — should fix during REFACTOR" ;;
esac

exit $EXIT_CODE
