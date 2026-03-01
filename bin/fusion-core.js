#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const command = process.argv[2];

const runScript = (scriptName, args = []) => {
  const scriptPath = path.join(__dirname, '..', '.claude', 'scripts', scriptName);
  try {
    console.log(`🚀 Executing Fusion-Core command: ${scriptName}`);
    execSync(`bash "${scriptPath}" ${args.join(' ')}`, { stdio: 'inherit' });
  } catch {
    console.error(`❌ Command failed: ${scriptName}`);
    process.exit(1);
  }
};

switch (command) {
  case 'start': {
    const startScript = path.join(__dirname, 'scripts', 'start-project.sh');
    try {
      execSync(
        `bash "${startScript}" ${process.argv
          .slice(3)
          .map((a) => `"${a}"`)
          .join(' ')}`,
        { stdio: 'inherit' },
      );
    } catch {
      console.error('❌ Project start failed');
      process.exit(1);
    }
    break;
  }
  case 'init':
    runScript('init_pipeline.sh');
    break;
  case 'monitor':
    runScript('update_monitor.sh', process.argv.slice(3));
    break;
  case 'dispatch':
    runScript('dispatch_parallel.sh');
    break;
  case 'finish':
    runScript('finish-epic.sh');
    break;
  case 'extract-genes':
    try {
      const extractScript = path.join(__dirname, 'scripts', 'extract-genes.sh');
      console.log('🧬 Executing Gene Extractor...');
      execSync(`bash "${extractScript}"`, { stdio: 'inherit' });
    } catch {
      console.error('❌ Gene extraction failed');
      process.exit(1);
    }
    break;
  case 'uninstall':
    try {
      execSync(`bash "${path.join(__dirname, '..', 'uninstall.sh')}"`, { stdio: 'inherit' });
    } catch {
      process.exit(1);
    }
    break;
  default:
    console.log(`
🏥 Fusion-Core CLI (v4.1.0)
用法: npx fusion-core <command>

Commands:
  start <name>    - 启动新项目 (初始化 + 激活 Stage 0)
  init            - 初始化 pipeline 目录结构 (仅建目录)
  monitor         - 更新 monitor.md 看板状态
  dispatch        - 触发 13 兵种的 tmux 并发盲打
  finish          - 触发 Epic 封版与 Github PR 流程
  extract-genes   - 提取战役经验为 Gene 文件 (Stage 7 Post-Hook)
  uninstall       - 安全解除大模型挂载

Quick Start:
  npx fusion-core start "我的项目"
  然后告诉 AI: "我要做一个 XXX 系统"
    `);
    break;
}
