#!/usr/bin/env node
/**
 * Fusion-Core Programmatic Role Router (Context Assembler)
 * 作用: 将大模型"自觉"读取规则转化为：被动硬读取 + 工具权限降维 + 上下文压缩。
 * 基于 Vercel "AGENTS.md" No-Decision Point 理论重构。
 *
 * V4 增强: 支持 --task 自动推荐兵种（无需 --role）。
 * V4.1 增强: 支持 --capabilities 直接传入能力标签匹配兵种。
 * V4.1.1 整改: --task 分支复用 matchRoles()，消灭重复 KEYWORD_MAP。
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { getRoute, isValidRole, matchByCapabilities, matchRoles } = require('../lib/model-routing');

const args = process.argv.slice(2);
const roleIndex = args.indexOf('--role');
const taskIndex = args.indexOf('--task');
const capsIndex = args.indexOf('--capabilities');

if (taskIndex === -1) {
  console.error('🚨 用法错误: npx fusion-router --role <role_name> --task <task_description_file>');
  console.error('   或: npx fusion-router --task <task_description_file>  (V4: 自动推荐兵种)');
  console.error(
    '   或: npx fusion-router --capabilities "rest-api,auth" --task <file>  (V4.1: 能力标签匹配)',
  );
  process.exit(1);
}

const taskFile = args[taskIndex + 1];
const skillsDir = path.join(process.cwd(), '.claude', 'skills');
let roleName;

/**
 * 从文本内容中提取关键词（Router 专属，不属于 model-routing 的职责）
 * @param {string} text - 任务文件内容（已 toLowerCase）
 * @returns {string[]} 提取到的关键词列表
 */
function extractKeywordsFromContent(text) {
  const TASK_KEYWORDS = [
    'api',
    'rest',
    'graphql',
    'swagger',
    'database',
    'schema',
    'migration',
    'sql',
    'ui',
    'component',
    'css',
    'html',
    'layout',
    'fetch',
    'swr',
    'state',
    'binding',
    'domain',
    'business',
    'validation',
    'security',
    'owasp',
    'audit',
    'test',
    'playwright',
    'e2e',
    'ai',
    'llm',
    'prompt',
    'prd',
    'requirement',
    'bdd',
    'architecture',
    'design',
    'gene',
    'pattern',
  ];

  return TASK_KEYWORDS.filter((kw) => text.includes(kw));
}

if (roleIndex !== -1) {
  // 显式指定角色（向后兼容）
  roleName = args[roleIndex + 1];
  if (!isValidRole(roleName)) {
    console.error(`🚨 越权拦截: 角色 [${roleName}] 不在合法的 13 兵种序列内。`);
    process.exit(1);
  }
} else if (capsIndex !== -1) {
  // V4.1: 直接传入能力标签
  const capsArg = args[capsIndex + 1];
  if (!capsArg) {
    console.error('🚨 --capabilities 需要参数，如: --capabilities "rest-api,auth"');
    process.exit(1);
  }

  const requestedCaps = capsArg
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const matches = matchRoles({ capabilities: requestedCaps, skillsDir });

  if (matches.length === 0) {
    console.error(`🚨 无兵种匹配能力标签 [${requestedCaps.join(', ')}]，请使用 --role 显式指定。`);
    process.exit(1);
  }

  roleName = matches[0].role;
  console.log(`\n🧬 [V4.1 Capability-Match] 标签: [${requestedCaps.join(', ')}]`);
  console.log(
    `   推荐兵种: ${roleName} (匹配度: ${(matches[0].score * 100).toFixed(0)}%) [来源: ${matches[0].source}]`,
  );
  if (matches.length > 1) {
    console.log(
      `   备选: ${matches
        .slice(1, 3)
        .map((m) => `${m.role}(${(m.score * 100).toFixed(0)}%)`)
        .join(', ')}`,
    );
  }
} else {
  // V4: 自动推荐兵种 — 从 task 文件提取关键词，通过 matchRoles 统一匹配
  let taskContent = '';
  try {
    taskContent = fs.readFileSync(taskFile, 'utf8').toLowerCase();
  } catch {
    console.error(`🚨 无法读取任务文件: ${taskFile}`);
    process.exit(1);
  }

  const detectedKeywords = extractKeywordsFromContent(taskContent);
  if (detectedKeywords.length === 0) {
    console.error(
      '🚨 无法从任务文件中检测到能力关键词，请使用 --role 或 --capabilities 显式指定兵种。',
    );
    process.exit(1);
  }

  const matches = matchRoles({ keywords: detectedKeywords, skillsDir });
  if (matches.length === 0) {
    console.error('🚨 无兵种匹配检测到的能力标签，请使用 --role 或 --capabilities 显式指定。');
    process.exit(1);
  }

  roleName = matches[0].role;
  console.log(`\n🧬 [V4 Auto-Match] 检测到关键词: [${detectedKeywords.join(', ')}]`);
  console.log(
    `   推荐兵种: ${roleName} (匹配度: ${(matches[0].score * 100).toFixed(0)}%) [来源: ${matches[0].source}]`,
  );
  if (matches.length > 1) {
    console.log(
      `   备选: ${matches
        .slice(1, 3)
        .map((m) => `${m.role}(${(m.score * 100).toFixed(0)}%)`)
        .join(', ')}`,
    );
  }
}

// 2. 环境隔离 (Sandboxing)
console.log(`\n======================================================`);
console.log(`🛡️ Fusion-Core Router Activated [Context Assembler v4.1]`);
console.log(`> 挂载兵种: ${roleName}`);
console.log(`> 战术目标: ${taskFile}`);

// 3. 从共享路由模块获取模型信息
const routeEntry = getRoute(roleName);
const modelName = routeEntry ? routeEntry.model : 'sonnet';
console.log(`> 路由模型: ${modelName} (${routeEntry ? routeEntry.tier : 'default'})`);
if (routeEntry && routeEntry.capabilities) {
  console.log(`> 能力标签: [${routeEntry.capabilities.join(', ')}]`);
}

// 4. 动态提取该 Role 的强纪律法则 (Context Compression)
const rulesPath = path.join(process.cwd(), '.claude/rules/01-fusion-roles.md');
let roleSpecificRules = '暂时未能定位到本兵种细节法则，请遵循基础安全守则。';

if (fs.existsSync(rulesPath)) {
  const rulesContent = fs.readFileSync(rulesPath, 'utf8');

  const regex = new RegExp(
    `### \\d+\\.?[\\s\\S]*?(${roleName}|${roleName.split('-')[0]})[\\s\\S]*?(?=### \\d+\\. |## |$)`,
    'i',
  );
  const match = rulesContent.match(regex);
  if (match) {
    roleSpecificRules = match[0].trim();
  }
}

console.log(`> 读取并提纯专用法则成功 (${roleSpecificRules.length} bytes)`);
console.log(`======================================================\n`);

// 5. 构建强硬不可跳过的 AGENTS.md 级别注入 (No Decision Point)
const systemContext = `
[SYSTEM HARD LOCK: FUSION CONTEXT ASSEMBLER]
你已经被剥夺了一切底层自主决定角色的自由。
你的物理代号被锁定为: 【${roleName}】

[YOUR BOUNDARY (你的职责红线)]:
${roleSpecificRules}

[YOUR TASK (你的刺杀目标)]:
请立刻读取 \`${taskFile}\` 开始工作。
任何输出交付物，无论是代码还是文档，前置首行或文件头部必须带上：<!-- Author: ${roleName} -->。如果不带，你在 pre-commit 时会被物理斩杀。

注意：你的工具权限可能已经被基于 FUSION_ROLE 的环境拦截器剥夺了 write_file 权限 (如果你是 QA 或 PM)。请在物理权限内执行。
`;

// 6. 将 FUSION_ROLE 写入环境变量并触发原生进程
try {
  console.log(`[Router] 开始释放子进程... 权限锁骨架已挂载 [FUSION_ROLE=${roleName}]\n`);

  const env = Object.assign({}, process.env, { FUSION_ROLE: roleName });

  console.log(
    `\n================= 传给底层引擎的静默 Prompt =================\n${systemContext}\n===========================================================\n`,
  );

  // 通过 --model 参数传递路由模型给 Claude CLI（可消费输出）
  const child = spawn('npx', ['claude', '--model', modelName, '-p', systemContext], {
    env,
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: process.platform === 'win32',
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log(`\n✅ [Router] 兵种沙箱进程执行完毕 [FUSION_ROLE=${roleName}]`);
    } else if (code === null) {
      console.log(`\n⚠️ [Router] 进程被中断 [FUSION_ROLE=${roleName}]`);
    } else {
      console.log(
        `\n✅ [Router] 兵种沙箱进程执行完毕 (exit code: ${code}) [FUSION_ROLE=${roleName}]`,
      );
    }
  });

  child.on('error', (err) => {
    console.error(`❌ [Router] 进程派发失败: ${err.message}`);
    process.exit(1);
  });
} catch (error) {
  console.error(`❌ [Router] 进程派发失败。`);
  process.exit(1);
}
