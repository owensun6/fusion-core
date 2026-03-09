#!/usr/bin/env python3
"""
feature-board.py — 从 FEATURE_LIST.md 生成可视化 HTML 看板

用法:
  python3 bin/scripts/feature-board.py [FEATURE_LIST.md 路径]

默认路径: pipeline/0_requirements/FEATURE_LIST.md
输出路径: pipeline/FEATURE_BOARD.html
"""

import sys
import re
import os
import webbrowser
from pathlib import Path


def find_feature_list(custom_path=None):
    """查找 FEATURE_LIST.md 文件"""
    if custom_path and os.path.exists(custom_path):
        return custom_path

    candidates = [
        "pipeline/0_requirements/FEATURE_LIST.md",
        "FEATURE_LIST.md",
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return None


def parse_tracking_table(content):
    """解析追踪总表，返回 (headers, rows)"""
    lines = content.split("\n")

    # 找到追踪总表
    in_table = False
    header_line = None
    separator_found = False
    rows = []
    headers = []

    for line in lines:
        stripped = line.strip()

        # 检测表头行（包含 F-ID 和 PM）
        if not in_table and "|" in stripped and "F-ID" in stripped and "PM" in stripped:
            header_line = stripped
            headers = [h.strip() for h in stripped.split("|") if h.strip()]
            in_table = True
            continue

        # 跳过分隔行
        if in_table and not separator_found and re.match(r"^\|[\s\-|]+\|$", stripped):
            separator_found = True
            continue

        # 解析数据行
        if in_table and separator_found:
            if not stripped or not stripped.startswith("|"):
                break
            cells = [c.strip() for c in stripped.split("|") if c.strip() != ""]
            if cells and cells[0].startswith("F"):
                rows.append(cells)

    return headers, rows


def cell_status(value):
    """判断单元格状态: done / fail / pending / empty"""
    v = value.strip()
    if not v:
        return "empty"
    if v in ("✅", "✓", "[x]", "PASS"):
        return "done"
    if v in ("✗", "✗", "FAIL", "❌"):
        return "fail"
    if v in ("⬜", "—", "-", ""):
        return "empty"
    # 有内容但非完成标记 = 已填入（如 S-03, T-04）
    return "filled"


def status_color(status):
    """状态对应的颜色"""
    return {
        "done": "#22c55e",
        "filled": "#3b82f6",
        "fail": "#ef4444",
        "empty": "#e5e7eb",
    }.get(status, "#e5e7eb")


def status_bg(status):
    """状态对应的背景色"""
    return {
        "done": "#f0fdf4",
        "filled": "#eff6ff",
        "fail": "#fef2f2",
        "empty": "#f9fafb",
    }.get(status, "#f9fafb")


def calculate_stats(headers, rows):
    """计算各阶段完成统计"""
    total = len(rows)
    if total == 0:
        return {}

    # 跳过 F-ID 和功能名称列
    stage_cols = headers[2:] if len(headers) > 2 else []
    stats = {}

    for i, col_name in enumerate(stage_cols):
        col_idx = i + 2
        done_count = 0
        filled_count = 0
        for row in rows:
            if col_idx < len(row):
                s = cell_status(row[col_idx])
                if s == "done":
                    done_count += 1
                elif s == "filled":
                    filled_count += 1
        stats[col_name] = {
            "done": done_count,
            "filled": filled_count,
            "total": total,
            "pct": round((done_count + filled_count) / total * 100),
        }

    return stats


def generate_html(headers, rows, stats, source_path):
    """生成 HTML 看板"""
    total = len(rows)

    # 计算整体验收进度
    accept_col = None
    for i, h in enumerate(headers):
        if "验收" in h:
            accept_col = i
            break

    accepted = 0
    if accept_col is not None:
        for row in rows:
            if accept_col < len(row) and cell_status(row[accept_col]) == "done":
                accepted += 1

    accept_pct = round(accepted / total * 100) if total > 0 else 0

    # 计算实现进度
    impl_col = None
    for i, h in enumerate(headers):
        if "实现" in h:
            impl_col = i
            break

    implemented = 0
    if impl_col is not None:
        for row in rows:
            if impl_col < len(row) and cell_status(row[impl_col]) == "done":
                implemented += 1

    impl_pct = round(implemented / total * 100) if total > 0 else 0

    # 阶段进度条 HTML
    stage_bars_html = ""
    stage_cols = headers[2:] if len(headers) > 2 else []
    for col_name in stage_cols:
        if col_name in stats:
            s = stats[col_name]
            stage_bars_html += f"""
            <div class="stage-bar">
                <div class="stage-label">{col_name}</div>
                <div class="bar-track">
                    <div class="bar-fill" style="width: {s['pct']}%; background: {
                        '#22c55e' if s['pct'] == 100 else '#3b82f6' if s['pct'] > 0 else '#e5e7eb'
                    };"></div>
                </div>
                <div class="stage-num">{s['done'] + s['filled']}/{s['total']}</div>
            </div>"""

    # 表格行 HTML
    table_rows_html = ""
    for row in rows:
        cells_html = ""
        for i, cell in enumerate(row):
            if i == 0:
                # F-ID 列
                cells_html += f'<td class="fid">{cell}</td>'
            elif i == 1:
                # 功能名称列
                cells_html += f'<td class="fname">{cell}</td>'
            else:
                s = cell_status(cell)
                icon = {
                    "done": "✅",
                    "filled": cell,
                    "fail": "❌",
                    "empty": "—",
                }.get(s, cell)
                cells_html += f'<td class="status-cell" style="background: {status_bg(s)}; color: {status_color(s)}; font-weight: {"600" if s in ("done", "fail") else "400"};">{icon}</td>'

        # 补齐缺失列
        while len(row) < len(headers):
            cells_html += '<td class="status-cell" style="background: #f9fafb; color: #e5e7eb;">—</td>'
            row.append("")

        table_rows_html += f"<tr>{cells_html}</tr>\n"

    # 表头 HTML
    header_html = "".join(f"<th>{h}</th>" for h in headers)

    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Feature Board — 功能追踪看板</title>
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: #f8fafc;
    color: #1e293b;
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }}
  .header {{
    text-align: center;
    margin-bottom: 32px;
  }}
  .header h1 {{
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
  }}
  .header .meta {{
    color: #64748b;
    font-size: 14px;
  }}

  /* 进度总览 */
  .overview {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 32px;
  }}
  .overview-card {{
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }}
  .overview-card .label {{
    font-size: 14px;
    color: #64748b;
    margin-bottom: 8px;
  }}
  .overview-card .big-num {{
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 8px;
  }}
  .progress-bar {{
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
  }}
  .progress-bar .fill {{
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s;
  }}

  /* 阶段进度 */
  .stages {{
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 32px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }}
  .stages h2 {{
    font-size: 16px;
    font-weight: 600;
    color: #334155;
    margin-bottom: 16px;
  }}
  .stage-bar {{
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }}
  .stage-label {{
    width: 60px;
    font-size: 13px;
    font-weight: 500;
    color: #475569;
    text-align: right;
  }}
  .bar-track {{
    flex: 1;
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    overflow: hidden;
  }}
  .bar-fill {{
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s;
  }}
  .stage-num {{
    width: 50px;
    font-size: 12px;
    color: #94a3b8;
  }}

  /* 功能表格 */
  .table-wrap {{
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    overflow-x: auto;
  }}
  .table-wrap h2 {{
    font-size: 16px;
    font-weight: 600;
    color: #334155;
    margin-bottom: 16px;
  }}
  table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }}
  th {{
    background: #f1f5f9;
    padding: 10px 14px;
    text-align: left;
    font-weight: 600;
    font-size: 13px;
    color: #475569;
    border-bottom: 2px solid #e2e8f0;
    white-space: nowrap;
  }}
  td {{
    padding: 10px 14px;
    border-bottom: 1px solid #f1f5f9;
  }}
  tr:hover {{ background: #f8fafc; }}
  .fid {{
    font-family: 'SF Mono', Consolas, monospace;
    font-weight: 600;
    color: #6366f1;
    white-space: nowrap;
  }}
  .fname {{
    max-width: 240px;
  }}
  .status-cell {{
    text-align: center;
    font-size: 13px;
    white-space: nowrap;
    border-radius: 4px;
  }}

  /* 图例 */
  .legend {{
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-top: 24px;
    font-size: 13px;
    color: #64748b;
  }}
  .legend-item {{
    display: flex;
    align-items: center;
    gap: 6px;
  }}
  .legend-dot {{
    width: 12px;
    height: 12px;
    border-radius: 3px;
  }}

  .footer {{
    text-align: center;
    margin-top: 32px;
    font-size: 12px;
    color: #94a3b8;
  }}

  @media print {{
    body {{ padding: 12px; }}
    .overview {{ grid-template-columns: 1fr 1fr; }}
  }}
</style>
</head>
<body>

<div class="header">
  <h1>Feature Board</h1>
  <div class="meta">
    Source: {source_path} | {total} features tracked |
    Generated: <span id="gen-time"></span>
  </div>
</div>

<div class="overview">
  <div class="overview-card">
    <div class="label">Implementation Progress</div>
    <div class="big-num" style="color: {'#22c55e' if impl_pct == 100 else '#3b82f6'}">{impl_pct}%</div>
    <div class="progress-bar">
      <div class="fill" style="width: {impl_pct}%; background: {'#22c55e' if impl_pct == 100 else '#3b82f6'};"></div>
    </div>
    <div style="margin-top: 6px; font-size: 13px; color: #94a3b8;">{implemented}/{total} features implemented</div>
  </div>
  <div class="overview-card">
    <div class="label">Acceptance Progress</div>
    <div class="big-num" style="color: {'#22c55e' if accept_pct == 100 else '#f59e0b'}">{accept_pct}%</div>
    <div class="progress-bar">
      <div class="fill" style="width: {accept_pct}%; background: {'#22c55e' if accept_pct == 100 else '#f59e0b'};"></div>
    </div>
    <div style="margin-top: 6px; font-size: 13px; color: #94a3b8;">{accepted}/{total} features accepted</div>
  </div>
</div>

<div class="stages">
  <h2>Stage Progress</h2>
  {stage_bars_html}
</div>

<div class="table-wrap">
  <h2>Feature Tracking Matrix</h2>
  <table>
    <thead><tr>{header_html}</tr></thead>
    <tbody>
      {table_rows_html}
    </tbody>
  </table>
</div>

<div class="legend">
  <div class="legend-item"><div class="legend-dot" style="background: #22c55e;"></div> Done</div>
  <div class="legend-item"><div class="legend-dot" style="background: #3b82f6;"></div> In Progress</div>
  <div class="legend-item"><div class="legend-dot" style="background: #ef4444;"></div> Failed</div>
  <div class="legend-item"><div class="legend-dot" style="background: #e5e7eb;"></div> Not Started</div>
</div>

<div class="footer">
  Fusion-Core Feature Board | Auto-generated from FEATURE_LIST.md
</div>

<script>
  document.getElementById('gen-time').textContent = new Date().toLocaleString('zh-CN');
</script>

</body>
</html>"""
    return html


def main():
    custom_path = sys.argv[1] if len(sys.argv) > 1 else None
    source = find_feature_list(custom_path)

    if not source:
        print("Error: FEATURE_LIST.md not found.")
        print("Usage: python3 feature-board.py [path/to/FEATURE_LIST.md]")
        sys.exit(1)

    print(f"Reading: {source}")

    with open(source, "r", encoding="utf-8") as f:
        content = f.read()

    headers, rows = parse_tracking_table(content)

    if not rows:
        print("Error: No tracking table found in FEATURE_LIST.md")
        print("Expected a table with columns: F-ID | 功能名称 | PM | 原型 | 接口 | Task | 实现 | QA | 验收")
        sys.exit(1)

    print(f"Found: {len(rows)} features, {len(headers)} columns")

    stats = calculate_stats(headers, rows)
    html = generate_html(headers, rows, stats, source)

    # 输出到 pipeline/ 目录
    output_dir = os.path.dirname(source)
    if "pipeline" in source:
        output_path = os.path.join(os.path.dirname(os.path.dirname(source)), "FEATURE_BOARD.html")
    else:
        output_path = "FEATURE_BOARD.html"

    # 确保输出目录存在
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)

    abs_path = os.path.abspath(output_path)
    print(f"Generated: {output_path}")
    print(f"Opening in browser...")

    webbrowser.open(f"file://{abs_path}")


if __name__ == "__main__":
    main()
