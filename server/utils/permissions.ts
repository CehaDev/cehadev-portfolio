export const PERMISSIONS = {
  ARTICLE_READ: 'article.read',
  ARTICLE_WRITE: 'article.write',
  ARTICLE_PUBLISH: 'article.publish',
  ARTICLE_DELETE: 'article.delete',
  MONITORING_READ: 'monitoring.read',
  ADMIN_READ: 'admin.read',
  IDENTITY_MANAGE: 'identity.manage'
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const DEFAULT_ROLES = [
  { id: 'admin', name: 'Admin', permissions: Object.values(PERMISSIONS) },
  { id: 'editor', name: 'Editor', permissions: [PERMISSIONS.ARTICLE_READ, PERMISSIONS.ARTICLE_WRITE, PERMISSIONS.ARTICLE_PUBLISH] },
  { id: 'viewer', name: 'Viewer', permissions: [PERMISSIONS.ARTICLE_READ, PERMISSIONS.MONITORING_READ] }
] as const
