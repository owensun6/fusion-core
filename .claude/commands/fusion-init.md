---
description: 【初始化】Fusion-Core 纯净环境初始化
argument-hint: ''
allowed-tools: Bash, Read, Glob, Grep, Write, Edit
---

# Fusion Init

> Initialize a new Fusion-Core pipeline project

## Usage

```
/fusion-init
```

## Description

Initializes a new Fusion-Core pipeline project by:

1. **Creating pipeline directory structure**:
   - `pipeline/0_requirements/` - Requirements artifacts
   - `pipeline/1_architecture/` - Architecture artifacts
   - `pipeline/2_planning/` - Task planning artifacts
   - `pipeline/3_review/` - Review/audit artifacts

2. **Initializing git hooks** (if not already done):
   - Sets up Husky for commit validation
   - Configures lint-staged

3. **Creating monitor.md** tracking file

## Prerequisites

- Node.js 18+
- fusion-core package installed (`npm install`)

## Notes

- This command only initializes the structure; you still need to:
  - Run `npx fusion-core dispatch` to dispatch tasks
  - Manually complete each Stage/Gate workflow
