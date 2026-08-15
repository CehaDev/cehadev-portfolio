export interface CodeFile {
  name: string
  language: string
  content: string
}

export const CODE_LANGS = [
  { id: 'javascript', label: 'JavaScript', ext: 'js' },
  { id: 'typescript', label: 'TypeScript', ext: 'ts' },
  { id: 'python', label: 'Python', ext: 'py' },
  { id: 'php', label: 'PHP', ext: 'php' },
  { id: 'sql', label: 'SQL', ext: 'sql' },
  { id: 'bash', label: 'Bash / Shell', ext: 'sh' },
  { id: 'json', label: 'JSON', ext: 'json' },
  { id: 'html', label: 'HTML', ext: 'html' },
  { id: 'css', label: 'CSS', ext: 'css' },
  { id: 'java', label: 'Java', ext: 'java' },
  { id: 'go', label: 'Go', ext: 'go' },
  { id: 'rust', label: 'Rust', ext: 'rs' },
  { id: 'ruby', label: 'Ruby', ext: 'rb' },
  { id: 'dart', label: 'Dart', ext: 'dart' },
  { id: 'yaml', label: 'YAML', ext: 'yaml' }
] as const

export type CodeLangId = (typeof CODE_LANGS)[number]['id']

export function codeLangLabel(id: string): string {
  return CODE_LANGS.find((l) => l.id === id)?.label ?? id
}
