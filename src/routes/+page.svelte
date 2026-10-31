<script lang="ts">
	import { Moon, Sun, Waves, LockKeyhole, CalendarDays, Tent, Clock } from '@lucide/svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	let dark = $state(false);
</script>

<svelte:head
	><title>Sauna Studio — スタッフ向け案内</title><meta
		name="robots"
		content="noindex, nofollow"
	/></svelte:head
>
<div class:dark class="app-shell min-h-screen bg-background text-foreground">
	<a href="#main" class="skip-link">本文へ移動</a>
	<header class="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
		<p class="flex items-center gap-2 text-lg font-semibold">
			<Waves aria-hidden="true" class="size-6 text-primary" /> Sauna Studio
		</p>
		<Button
			variant="outline"
			size="icon"
			aria-label={dark ? 'ライトテーマに切り替え' : 'ダークテーマに切り替え'}
			onclick={() => (dark = !dark)}
			>{#if dark}<Sun aria-hidden="true" class="size-4" />{:else}<Moon
					aria-hidden="true"
					class="size-4"
				/>{/if}</Button
		>
	</header>
	<main id="main" class="mx-auto max-w-5xl px-6 py-14">
		<Badge variant="secondary">スタッフ向け</Badge>
		<h1 class="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
			施設を支える、<br />ひとつの場所。
		</h1>
		<p class="mt-6 max-w-xl text-base leading-8 text-muted-foreground">
			スタッフ用画面は現在準備中です。このページには予約・顧客・シフトのデータは表示されず、管理操作もできません。
		</p>
		<div class="mt-8 flex items-center gap-3">
			<Button disabled
				><LockKeyhole aria-hidden="true" class="size-4" /> Passkeyでログイン（準備中）</Button
			>
		</div>
		<p class="mt-3 text-sm text-muted-foreground">
			ログインと施設ごとの権限確認は、今後の実装で提供します。
		</p>
		<section class="mt-14 grid gap-4 md:grid-cols-3" aria-label="今後提供予定の機能">
			{#each [{ title: '予約', icon: CalendarDays }, { title: '設備', icon: Tent }, { title: 'シフト', icon: Clock }] as item (item.title)}
				<Card.Root class="shadow-none"
					><Card.Header
						><item.icon aria-hidden="true" class="mb-3 size-6 text-primary" /><Card.Title
							>{item.title}</Card.Title
						><Card.Description>提供準備中</Card.Description></Card.Header
					></Card.Root
				>
			{/each}
		</section>
	</main>
</div>
