<script lang="ts">
	import { fade, fly } from "svelte/transition";
	// import { dev } from "$app/environment";
	import Header from "./Header.svelte";
	import { Board } from "./board";
	import Keyboard from "./keyboard";
	import Modal from "./Modal.svelte";
	import { getContext, onMount, setContext } from "svelte";
	import Settings from "./settings";
	import {
		Share,
		Separator,
		Definition,
		Tutorial,
		Statistics,
		Distribution,
		Timer,
		Toaster,
		ShareGame,
		Tips,
		Historical,
	} from "./widgets";
	import {
		contractNum,
		DELAY_INCREMENT,
		PRAISE,
		modeData,
		ROWS,
		COLS,
		newSeed,
		GameState,
		seededRandomInt,
		LetterStates,
		words,
		Stats,
		getHint
	} from "../utils";
	import { letterStates, settings, mode } from "../stores";

	export let word: string;
	export let stats: Stats;
	export let game: GameState;
	export let toaster: Toaster;

	setContext("toaster", toaster);
	const version = getContext<string>("version");

	// implement transition delay on keys
	const delay = DELAY_INCREMENT * ROWS + 800;

	let showTutorial = $settings.tutorial === 3;
	let showSettings = false;
	let showStats = false;
	let showHistorical = false;
	let showRefresh = false;

	let board: Board;
	let timer: Timer;
	let hintCount = 0;

	let showFireworks = false;
	const fireworkColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

	function submitWord() {
		if (game.latestWord.length !== COLS) {
			toaster.pop("Herufi hazitoshi");
			board.shake(game.guesses);
		} else {
			if (game.guesses > 0) {
				const hm = game.checkHardMode();
				if ($settings.hard[$mode]) {
					if (hm.type === "🟩") {
						toaster.pop(
							`${contractNum(hm.pos + 1)} Herufi lazima iwe ${hm.char.toUpperCase()}`
						);
						board.shake(game.guesses);
						return;
					} else if (hm.type === "🟨") {
						toaster.pop(`Nadhani lazima iwe na ${hm.char.toUpperCase()}`);
						board.shake(game.guesses);
						return;
					}
				} else if (hm.type !== "⬛") {
					game.validHard = false;
				}
			}
			game.board.state[game.guesses] = game.guess(word);
			++game.guesses;
			$letterStates.update(game.lastState, game.lastWord);
			$letterStates = $letterStates;
			if (game.lastWord === word) win();
			else if (game.guesses === ROWS) lose();
		}
	}

	function win() {
		board.bounce(game.guesses - 1);
		game.active = false;
		showFireworks = true;
		console.log("Fireworks triggered!"); // Debug log
		setTimeout(() => {
			showFireworks = false;
			console.log("Fireworks hidden"); // Debug log
		}, 3000); // Display fireworks for 3 seconds
		setTimeout(
			() => toaster.pop(PRAISE[game.guesses - 1]),
			DELAY_INCREMENT * COLS + DELAY_INCREMENT
		);
		setTimeout(setShowStatsTrue, delay * 1.4);
		if (!modeData.modes[$mode].historical) {
			stats.addWin(game.guesses, modeData.modes[$mode]);
			stats = stats;
			localStorage.setItem(`stats-${$mode}`, stats.toString());
		}
	}

	// Add this function to provide a hint
	function provideHint() {
	if (hintCount < 3 && game.active) {
		const hint = getHint(word, game.board.words[game.guesses], hintCount);
		toaster.pop(hint);
		hintCount++;
	} else if (!game.active) {
		toaster.pop("Mchezo umeisha");
	} else {
		toaster.pop("Hamna kidokezo tena");
	}
	}

	function lose() {
		game.active = false;
		setTimeout(setShowStatsTrue, delay);
		if (!modeData.modes[$mode].historical) {
			stats.addLoss(modeData.modes[$mode]);
			stats = stats;
			localStorage.setItem(`stats-${$mode}`, stats.toString());
		}
	}

	function concede() {
		showSettings = false;
		setTimeout(setShowStatsTrue, DELAY_INCREMENT);
		lose();
	}

	function reload() {
		modeData.modes[$mode].historical = false;
		modeData.modes[$mode].seed = newSeed($mode);
		game = new GameState($mode, localStorage.getItem(`state-${$mode}`));
		word = words.words[seededRandomInt(0, words.words.length, modeData.modes[$mode].seed)];
		$letterStates = new LetterStates();
		showStats = false;
		showRefresh = false;
		timer.reset($mode);
		hintCount = 0; // Reset hint count when starting a new game
	}

	function setShowStatsTrue() {
		if (!game.active) showStats = true;
	}

	function onSwipe(e: Swipe) {
		switch (e.detail.direction) {
			case "left":
				$mode = ($mode + 1) % modeData.modes.length;
				toaster.pop(modeData.modes[$mode].name);
				break;
			case "right":
				$mode = ($mode - 1 + modeData.modes.length) % modeData.modes.length;
				toaster.pop(modeData.modes[$mode].name);
				break;
		}
	}

	onMount(() => {
		if (!game.active) setTimeout(setShowStatsTrue, delay);
		console.log(word)
	});


	// $: toaster.pop(word);
</script>

<svelte:body on:click={board.hideCtx} on:contextmenu={board.hideCtx} />

<main class:guesses={game.guesses !== 0} style="--rows: {ROWS}; --cols: {COLS}">
	<Header
		bind:showRefresh
		tutorial={$settings.tutorial === 2}
		on:closeTutPopUp|once={() => ($settings.tutorial = 1)}
		showStats={stats.played > 0 || (modeData.modes[$mode].historical && !game.active)}
		on:stats={() => (showStats = true)}
		on:tutorial={() => (showTutorial = true)}
		on:settings={() => (showSettings = true)}
		on:reload={reload}
	/>
	<Board
		bind:this={board}
		bind:value={game.board.words}
		tutorial={$settings.tutorial === 1}
		on:closeTutPopUp|once={() => ($settings.tutorial = 0)}
		board={game.board}
		guesses={game.guesses}
		icon={modeData.modes[$mode].icon}
		on:swipe={onSwipe}
	/>
	<Keyboard
		on:keystroke={() => {
			if ($settings.tutorial) $settings.tutorial = 0;
			board.hideCtx();
		}}
		bind:value={game.board.words[game.guesses === ROWS ? 0 : game.guesses]}
		on:submitWord={submitWord}
		on:esc={() => {
			showTutorial = false;
			showStats = false;
			showSettings = false;
		}}
		disabled={!game.active || $settings.tutorial === 3 || showHistorical}
	/>
	<div class="hint-button" on:click={provideHint}>Pata Msaada</div>

	{#if showFireworks}
		<div class="fireworks" transition:fade={{ duration: 1000 }}>
			{#each Array(3) as _, burstIndex}
				{#each Array(20) as _, i}
					<div
						class="particle"
						style="
							--angle: {i * 18}deg;
							--delay: {burstIndex * 500 + i * 50}ms;
							--color: {fireworkColors[Math.floor(Math.random() * fireworkColors.length)]};
							--burst-offset-x: {(Math.random() - 0.5) * 100}px;
							--burst-offset-y: {(Math.random() - 0.5) * 100}px;
						"
					/>
				{/each}
			{/each}
		</div>
	{/if}
</main>

<Modal
	bind:visible={showTutorial}
	on:close|once={() => $settings.tutorial === 3 && --$settings.tutorial}
	fullscreen={$settings.tutorial === 0}
>
	<Tutorial visible={showTutorial} />
</Modal>

<Modal bind:visible={showStats}>
	{#if modeData.modes[$mode].historical}
		<h2 class="historical">Statistics not available for historical games</h2>
	{:else}
		<Statistics data={stats} />
		<Distribution distribution={stats.guesses} {game} />
	{/if}
	<Separator visible={!game.active}>
		<Timer
			slot="1"
			bind:this={timer}
			on:timeup={() => (showRefresh = true)}
			on:reload={reload}
		/>
		<Share slot="2" state={game} />
	</Separator>
	<ShareGame wordNumber={game.wordNumber} />
	{#if !game.active}
		<Definition {word} alternates={2} />
	{:else}
		<!-- Fade with delay is to prevent a bright red button from appearing as soon as refresh is pressed -->
		<div
			in:fade={{ delay: 300 }}
			class="button concede"
			on:click={concede}
			on:keydown={concede}
		>
			give up
		</div>
	{/if}
</Modal>

<Modal fullscreen={true} bind:visible={showSettings}>
	<Settings state={game} on:historical={() => (showHistorical = true)} />
	{#if game.active}
		<div class="button concede" on:click={concede} on:keydown={concede}>give up</div>
	{/if}
	<Tips change={showSettings} />

	<svelte:fragment slot="footer">
		<a href="https://www.nytimes.com/games/wordle/" target="_blank" rel="noreferrer"
			>Original Wordle</a
		>
		<div>
			<div>v{version}</div>
			<div
				title="bofya mara mbili ili kuweka upya takwimu zako"
				class="word"
				on:dblclick={() => {
					localStorage.clear();
					toaster.pop("localStorage cleared");
				}}
			>
				{modeData.modes[$mode].name} word #{game.wordNumber}
			</div>
		</div>
	</svelte:fragment>
</Modal>

<Modal bind:visible={showHistorical}>
	<Historical bind:showSettings />
</Modal>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		height: 100%;
		max-width: var(--game-width);
		margin: auto;
		position: relative;
	}
	.historical {
		text-align: center;
		margin-top: 10px;
		padding: 0 20px;
		text-transform: uppercase;
	}
	.concede {
		background-color: var(--red);
	}
	.hint-button {
		background: linear-gradient(45deg, #ff6b6b, #f06595);
		color: white;
		padding: 10px 20px;
		border-radius: 5px;
		border: none;
		cursor: pointer;
		margin-bottom: 10px;
		user-select: none;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: background 0.3s, transform 0.3s;
	}
	.hint-button:hover {
		background: linear-gradient(45deg, #f06595, #ff6b6b);
		transform: translateY(-2px);
		box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
	}

	.fireworks {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 9999;
	}

	.particle {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 10px;
		height: 10px;
		background: var(--color);
		border-radius: 50%;
		transform: translate(-50%, -50%) translateX(var(--burst-offset-x)) translateY(var(--burst-offset-y));
		animation: explode 1.5s ease-out forwards;
		animation-delay: var(--delay);
	}

	@keyframes explode {
		0% {
			opacity: 1;
			transform: translate(-50%, -50%) translateX(var(--burst-offset-x)) translateY(var(--burst-offset-y)) scale(0.1);
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: translate(-50%, -50%) translateX(calc(var(--burst-offset-x) + (cos(var(--angle)) * 100px))) 
						 translateY(calc(var(--burst-offset-y) + (sin(var(--angle)) * 100px))) scale(0.5);
		}
	}
</style>