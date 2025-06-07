<script setup>
    import DataTable from 'primevue/datatable';
    const preset = {    
        root: ({ props }) => ({
            class: [
                'flex flex-col',
                'relative',
                'h-full text-base',

                // Flex & Alignment
                { 'flex flex-col': props.scrollable && props.scrollHeight === 'flex' },

            ]
        }),
        mask: {
            class: 'hidden'
        },
        wrapper: ({ props }) => ({
            class: [
                'calc(100% - 70px) grow',
                'overflow-auto',
                { relative: props.scrollable, 'flex flex-col grow': props.scrollable && props.scrollHeight === 'flex' },

                // Size
                'h-full'
            ]
        }),
        header: ({ props }) => ({
            class: [
                'font-bold',

                // Shape
                props.showGridlines ? 'border-x border-t border-b-0' : 'border-y border-x-0',

                // Spacing
                'p-3',

                // Color
                'bg-surface-50 dark:bg-surface-800',
                'border-surface-200 dark:border-surface-700',
                'text-surface-700 dark:text-white/80'
            ]
        }),
        table: {
            class: 'h-full w-full border-spacing-x-0 border-spacing-y-1 border-separate -mt-1' //bg-ground-bg // !h-auto перебивает inline style height
        },

        column: {
            headercell: ({ context, props }) => ({
                class: [
                    '!border-0',
                    'text-[14px] leading-none p-3 font-semibold',
                    // Position
                    { 'sticky z-20 border-b': props.frozen || props.frozen === '' },

                    { relative: context.resizable },

                    'py-[.375rem] px-[.5rem]',

                ]
            }),

            bodycell: ({ props, context, state, parent }) => ({
                class: [
                    "w-[209px] text-[14px] leading-tight text-dark-800 dark:text-[rgb(203,213,225)]",
                    'border-none',
                    //Position
                    { 'sticky box-border border-b': parent.instance.frozenRow },
                    { 'sticky box-border border-b': props.frozen || props.frozen === '' },

                    // Alignment
                    'text-left',

                    // Shape
                    // 'border border-solid border-t-0 border-r-0 last:border-r',
                    // { 'first:border-l border-r border-b': context?.showGridlines },
                    // { 'bg-surface-0 dark:bg-surface-800': parent.instance.frozenRow || props.frozen || props.frozen === '' },

                    // Spacing
                    { 'p-1': !state['d_editing'] },
                    { 'p-2': state['d_editing'] },

                    // Color
                    // 'border-[#B9B9B9] dark:border-surface-700'
                ]
            }),

            sorticon: ({ context }) => ({
                class: ['ml-2', context.sorted ? 'text-primary-700 dark:text-white/80' : 'text-surface-700 dark:text-white/70']
            }),
            sortbadge: {
                class: [
                    // Flex & Alignment
                    'flex items-center justify-center align-middle',

                    // Shape
                    'rounded-full',

                    // Size
                    'w-[1.143rem] leading-[1.143rem]',

                    // Spacing
                    'ml-2',

                    // Color
                    'text-primary-700 dark:text-white',
                    // 'bg-primary-50 dark:bg-primary-400/30'
                ]
            },
            transition: {
                enterFromClass: 'opacity-0 scale-y-[0.8]',
                enterActiveClass: 'transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]',
                leaveActiveClass: 'transition-opacity duration-100 ease-linear',
                leaveToClass: 'opacity-0'
            }
        },
    };
</script>

<template>
    <DataTable :pt="preset">
        <template #header v-if="$slots.header"> 
            <slot name="header"></slot>
        </template>
        <slot></slot>
        <template #loading v-if="$slots.loading">
          <slot name="loading"></slot>
        </template>
        <template #footer v-if="$slots.footer"> 
            <slot name="footer"></slot>
        </template>
    </DataTable>
</template>