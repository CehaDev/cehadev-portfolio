<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  adminTitle: 'Tambah Project'
})

async function onSaved() {
  await navigateTo('/admin/projects')
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div>
      <h2 class="text-xl font-bold text-text">Tambah Project Baru</h2>
      <p class="mt-1 text-sm text-text-secondary">Data akan disimpan sebagai file JSON di content/projects/.</p>
    </div>
    <AdminProjectForm endpoint="/api/admin/projects" method="POST" @saved="onSaved" />
  </div>
</template>
