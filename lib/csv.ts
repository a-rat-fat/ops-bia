export function toCsv(rows: any[], headers?: string[]): string {
  if (!rows || rows.length === 0) return ''
  const cols = headers ?? Object.keys(rows[0])
  const esc = (v: any) => {
    const s = v === null || v === undefined ? '' : String(v)
    return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  const head = cols.join(';')
  const body = rows.map(r => cols.map(c => esc(r[c])).join(';')).join('\n')
  return head + '\n' + body + '\n'
}
