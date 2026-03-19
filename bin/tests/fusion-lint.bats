#!/usr/bin/env bats
# fusion-lint.sh unit tests
# Run: bats bin/tests/fusion-lint.bats

LINT_SCRIPT="$(cd "$(dirname "$BATS_TEST_FILENAME")/.." && pwd)/fusion-lint.sh"

setup() {
  TMP_DIR="$(mktemp -d)"
  mkdir -p "$TMP_DIR/src"
}

teardown() {
  rm -rf "$TMP_DIR"
}

# Helper: write file relative to TMP_DIR
make_file() {
  local path="$TMP_DIR/$1"
  mkdir -p "$(dirname "$path")"
  printf '%s\n' "$2" > "$path"
}

# Helper: generate file with N lines (first line = Author stamp)
make_lines() {
  local path="$TMP_DIR/$1"
  local n="$2"
  mkdir -p "$(dirname "$path")"
  echo "// Author: be-domain-modeler" > "$path"
  for i in $(seq 2 "$n"); do echo "const x$i = $i;"; done >> "$path"
}

# ─── L1: Secret Scan ────────────────────────────────────────

@test "L1: clean file passes secret scan" {
  make_file "src/index.ts" "// Author: be-api-router
export const hello = () => 'world';"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 0 ]
  [[ "$output" == *"OK: No secrets detected"* ]]
}

@test "L1: hardcoded API_KEY triggers CRITICAL" {
  make_file "src/config.ts" "// Author: be-api-router
const API_KEY = 'my-secret-key';"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 1 ]
  [[ "$output" == *"CRITICAL"* ]]
}

@test "L1: OpenAI sk- token triggers CRITICAL" {
  make_file "src/ai.ts" "// Author: be-ai-integrator
const apiKey = 'sk-abcdefghijklmnop';"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 1 ]
  [[ "$output" == *"CRITICAL"* ]]
}

@test "L1: GitHub ghp_ token triggers CRITICAL" {
  make_file "src/github.ts" "// Author: be-api-router
const token = 'ghp_XXXXXXXXXXXXXXXX';"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 1 ]
  [[ "$output" == *"CRITICAL"* ]]
}

@test "L1: hardcoded PASSWORD triggers CRITICAL" {
  make_file "src/db.ts" "// Author: db-schema-designer
const PASSWORD = 'hunter2';"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 1 ]
  [[ "$output" == *"CRITICAL"* ]]
}

@test "L1: markdown file with API_KEY does not trigger scan" {
  make_file "README.md" "Set API_KEY = your_key_here in .env"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 0 ]
}

# ─── L2: Author Stamp ────────────────────────────────────────

@test "L2: ts file with Author stamp passes" {
  make_file "src/service.ts" "// Author: be-domain-modeler
export const compute = () => 42;"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 0 ]
  [[ "$output" == *"OK: All production files have Author stamp"* ]]
}

@test "L2: ts file missing Author stamp triggers ERROR" {
  make_file "src/service.ts" "export const compute = () => 42;"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 1 ]
  [[ "$output" == *"ERROR"* ]]
  [[ "$output" == *"Author stamp"* ]]
}

@test "L2: py file with Author stamp passes" {
  make_file "src/utils.py" "# Author: be-domain-modeler
def compute(): return 42"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 0 ]
}

@test "L2: sql file missing Author stamp triggers ERROR" {
  make_file "migrations/001.sql" "CREATE TABLE users (id INT);"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 1 ]
  [[ "$output" == *"ERROR"* ]]
}

@test "L2: test.ts file is excluded from Author stamp check" {
  make_file "src/service.test.ts" "describe('test', () => { it('works', () => {}) })"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 0 ]
}

@test "L2: spec.ts file is excluded from Author stamp check" {
  make_file "src/service.spec.ts" "describe('spec', () => {})"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 0 ]
}

@test "L2: files inside tests/ directory are excluded from Author stamp check" {
  make_file "tests/helper.ts" "export const setup = () => {}"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 0 ]
}

# ─── L3: Debug Residue ───────────────────────────────────────

@test "L3: console.log triggers WARNING (exit 2)" {
  make_file "src/index.ts" "// Author: fe-logic-binder
console.log('debug');
export const x = 1;"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 2 ]
  [[ "$output" == *"WARNING"* ]]
}

@test "L3: TODO comment triggers WARNING (exit 2)" {
  make_file "src/index.ts" "// Author: fe-ui-builder
// TODO: implement this
export const x = 1;"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 2 ]
  [[ "$output" == *"WARNING"* ]]
}

@test "L3: FIXME comment triggers WARNING (exit 2)" {
  make_file "src/index.ts" "// Author: be-api-router
// FIXME: broken
export const x = 1;"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 2 ]
  [[ "$output" == *"WARNING"* ]]
}

@test "L3: when L1 also fails, exit code is 1 not 2" {
  make_file "src/index.ts" "// Author: be-api-router
const API_KEY = 'secret';
console.log('debug');"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 1 ]
}

# ─── L4: File Size ───────────────────────────────────────────

@test "L4: file with exactly 300 lines passes" {
  make_lines "src/big.ts" 300
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 0 ]
}

@test "L4: file with 301 lines triggers WARNING (exit 2)" {
  make_lines "src/big.ts" 301
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 2 ]
  [[ "$output" == *"OVERSIZED"* ]]
}

@test "L4: large file inside node_modules is ignored" {
  mkdir -p "$TMP_DIR/node_modules/some-lib"
  make_lines "node_modules/some-lib/index.ts" 500
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 0 ]
}

# ─── Summary output ──────────────────────────────────────────

@test "Summary shows PASS when all checks pass" {
  make_file "src/index.ts" "// Author: be-api-router
export const hello = () => 'world';"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 0 ]
  [[ "$output" == *"PASS: All checks green"* ]]
}

@test "Summary shows BLOCKED when CRITICAL found" {
  make_file "src/index.ts" "// Author: be-api-router
const API_KEY = 'secret';"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 1 ]
  [[ "$output" == *"BLOCKED"* ]]
}

@test "Summary shows WARNING when only warnings found" {
  make_file "src/index.ts" "// Author: fe-ui-builder
// TODO: fix later
export const x = 1;"
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 2 ]
  [[ "$output" == *"WARNING: Non-critical"* ]]
}

@test "empty directory passes all checks" {
  run bash "$LINT_SCRIPT" "$TMP_DIR"
  [ "$status" -eq 0 ]
}
