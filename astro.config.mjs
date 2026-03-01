import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'Fusion-Core Engine Docs',
            social: {
                github: 'https://github.com/your-org/fusion-core',
            },
            sidebar: [
                {
                    label: 'Tutorials (学习)',
                    autogenerate: { directory: 'tutorials' },
                },
                {
                    label: 'How-to Guides (实操)',
                    autogenerate: { directory: 'how-to' },
                },
                {
                    label: 'Explanation (原理)',
                    autogenerate: { directory: 'explanation' },
                },
                {
                    label: 'Reference (字典)',
                    autogenerate: { directory: 'reference' },
                },
            ],
        }),
    ],
});
