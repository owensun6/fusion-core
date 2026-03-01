#!/usr/bin/env node
/**
 * Fusion-Core: Clean Slate Initializer (纯净环境初始化器)
 * 作用: 当在新项目拉起 Fusion-Core 时，物理剥离并备份所有阻碍或冲突的旧版敏捷规则（如 CCBest）。
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

console.log(`\n🚀 [Fusion-Core] 正在执行纯净环境剥离与初始化 (Clean Slate Protocol)...`);

const cwd = process.cwd();
const targetClaudeDir = path.join(cwd, '.claude');

// 1. 物理检查旧版 .claude 是否存在
if (fs.existsSync(targetClaudeDir)) {
  console.log(
    `⚠️ 检测到当前项目已存在 .claude 目录，可能包含与 Fusion-Core 冲突的传统大一统敏捷规则。`,
  );

  // 2. 将旧目录防腐隔离至与代码无关的宿主系统目录下
  const backupBaseDir = path.join(os.homedir(), '.fusion_backups');
  if (!fs.existsSync(backupBaseDir)) {
    fs.mkdirSync(backupBaseDir, { recursive: true });
  }

  const timestamp = Date.now();
  const projectName = path.basename(cwd);
  const backupPath = path.join(backupBaseDir, `${projectName}_claude_bak_${timestamp}`);

  try {
    // 使用跨平台的重命名/移动
    fs.renameSync(targetClaudeDir, backupPath);
    console.log(`✅ [物理剥离成功]: 原有冲突规则已被隔离至与代码无关的保险区:`);
    console.log(`   📂 ${backupPath}`);
  } catch (e) {
    console.error(`❌ [致命错误]: 无法移除旧的 .claude 目录，请手动删除后重试！`, e);
    process.exit(1);
  }
} else {
  console.log(`✅ 当前项目尚未被旧版约束污染，环境纯净。`);
}

// 3. 注入纯血 Fusion-Core 纪律矩阵
// (因为此脚本通常是从全局 npx fusion-init 或者 node_modules 里执行，需要找到包的根目录)
const corePackageDir = path.resolve(__dirname, '..');
const sourceClaudeDir = path.join(corePackageDir, '.claude');

if (!fs.existsSync(sourceClaudeDir)) {
  console.error(`❌ [致命错误]: 找不到 Fusion-Core 的原生 .claude 源目录 (${sourceClaudeDir})。`);
  process.exit(1);
}

console.log(`🛡️ 正在注入 Fusion-Core 原生装甲 (Rules, Hooks, Commands)...`);
try {
  // 跨平台克隆目录 (Mac/Linux 用 cp -R)
  execSync(`cp -R "${sourceClaudeDir}" "${cwd}/.claude"`, { stdio: 'inherit' });
  console.log(`✅ 纪律矩阵注入完毕！`);
  console.log(`\n🎉 [Fusion-Core] 初始化已完成。您的代码库现在受最高安全协议保护。`);
  console.log(`👉 您现在可以敲击 npx fusion-router 或者使用 .claude/commands/ 下战术武器。`);
} catch (e) {
  console.error(`❌ [致命错误]: 无法拷贝原生矩阵。`, e);
  process.exit(1);
}
