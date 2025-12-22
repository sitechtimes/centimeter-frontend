<template>
	<div class="group cursor-pointer">
		<div class="bg-[var(--bg-color)] rounded-lg border border-[var(--faded-bg-color)] overflow-hidden hover:shadow-lg transition-shadow">
			<div class="relative aspect-[4/3] bg-[var(--faded-bg-color-light)]">
				<div class="absolute top-3 right-3 bg-[var(--bg-color)] rounded p-1.5 shadow-sm">
					<LayoutGrid />
				</div>
			</div>
		</div>

		<div class="mt-3 flex items-start gap-3">
			<div class="flex items-center justify-center w-9 h-9 bg-[var(--faded-bg-color)] rounded-full text-xs font-semibold shrink-0 text-[var(--text-color)]">
				{{ initials }}
			</div>
			<div class="flex-1 min-w-0">
				<h3 class="text-sm font-medium text-[var(--text-color)] truncate group-hover:text-[var(--primary)]">
					{{ presentation.presentation_name }}
				</h3>
				<p class="text-xs text-[var(--gray)] mt-0.5">
					Edited {{ formattedDate }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { LayoutGrid } from 'lucide-vue-next'

interface Presentation {
	presentation_name: string
	host: string
	last_interacted: string
}

const props = defineProps<{ presentation: Presentation }>()

const initials = computed(() => {
	const words = props.presentation.host.split(' ')
	if (words.length >= 2) {
		return (words[0][0] + words[words.length - 1][0]).toUpperCase()
	}
	return props.presentation.host.substring(0, 2).toUpperCase()
})

const formattedDate = computed(() => formatDate(props.presentation.last_interacted))

const formatDate = (dateString: string): string => {
	const date = new Date(dateString)
	const now = new Date()
	const diffInMs = now.getTime() - date.getTime()
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

	if (diffInDays === 0) return 'today'
	if (diffInDays === 1) return 'yesterday'
	if (diffInDays < 30) return `${diffInDays} days ago`

	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

	return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}
</script>
