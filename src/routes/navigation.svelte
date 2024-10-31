<script lang="ts">
	import { onNavigate } from '$app/navigation'

	onNavigate(async navigation => {
		//@ts-ignore
		if (document.startViewTransition) {
			await new Promise<void>(resolve => {
				//@ts-ignore
				document.startViewTransition(async () => {
					await navigation.complete
					resolve() // Resolve the promise after the transition is complete
				})
			})
		}
		return
	})
</script>
