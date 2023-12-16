import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Takotubo Club',
			social: {
				twitter: 'https://twitter.com/takotubo_club',
				github: 'https://github.com/10rin0',
			},
			customCss: [
				// カスタムCSSファイルへの相対パス
				'./src/style/custom.css',
			],

			sidebar: [
				{
					label: 'メニュー',
					// デフォルトで折りたたむ
					collapsed: true,
					items: [
						{ label: 'はじめに', link: '/' },
						{ label: 'ブックマーク', link: '/link/' },
						{ label: 'BBS', link: 'https://takotubo.10rino.net/bbs/tegalog.cgi' },
						{ label: 'メモ', link: 'https://takotubo.10rino.net/note/tegalog.cgi' },
						{ label: 'プライバシーポリシー・免責事項', link: '/terms/' },
					],
				},
				{
					label: 'tegalog',
					// tegalogディレクトリのリンクグループを自動生成します。
					autogenerate: { directory: 'tegalog' },
				},
				{
					label: 'おまけ',
					// デフォルトで折りたたむ
					collapsed: true,
					// tegalogディレクトリのリンクグループを自動生成します。
					autogenerate: { directory: 'omake' },
				},
			],
		}),
	],
	site: 'https://10rin0.github.io',
	base: '/takodoc',
});
