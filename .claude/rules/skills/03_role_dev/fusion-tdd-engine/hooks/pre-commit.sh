#!/usr/bin/env bash

# Fusion Core - TDD 强约束预提交门禁 (Pre-commit Hook)
# 位置: skills/03_role_dev/fusion-tdd-engine/hooks/pre-commit.sh
# 作用: 拦截一切没加测试文件就想提交的野路子代码。

# 获取全部暂存区文件
STAGED_FILES=$(git diff --cached --name-only)

# 如果没有文件提交，直接通行
if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

# 检查是否有测试文件被暂存 (比如包含 test 或 spec)
HAS_TEST=false
for FILE in $STAGED_FILES; do
  if [[ "$FILE" == *"test"* ]] || [[ "$FILE" == *"spec"* ]]; then
    HAS_TEST=true
    break
  fi
done

# 源文件过滤 (简化示例，仅拦截包含 .ts, .js, .py 扩展的业务码)
HAS_SRC=false
for FILE in $STAGED_FILES; do
  if [[ "$FILE" =~ \.(ts|tsx|js|jsx|py)$ ]] && [[ "$FILE" != *"test"* ]] && [[ "$FILE" != *"spec"* ]]; then
    HAS_SRC=true
    break
  fi
done

if [ "$HAS_SRC" = true ] && [ "$HAS_TEST" = false ]; then
  echo "❌ [Fusion Guard] 提交阻塞！"
  echo "你暂存了业务源码，却没有任何测试文件伴随提交！"
  echo "请遵循 Dev 军团的 TDD 红绿法则：无测试，不准交！"
  exit 1
fi

echo "✅ [Fusion Guard] TDD 验证通过，允许通行。"
exit 0
