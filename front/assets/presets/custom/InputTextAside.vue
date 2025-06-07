<script setup>
import InputText from 'primevue/inputtext';

const preset = {
    root: ({ props, context, parent, attrs }) => {
        return {
        class: [
            //Size
            'w-full p-2',

            // Font
            'leading-snug',

            // Flex
            { 'flex-1 w-[1%]': parent.instance.$name === 'InputGroup' },

            // Spacing
            'w-full m-0',


            // Shape
            { 'rounded-md': parent.instance.$name !== 'InputGroup' },
            { 'first:rounded-l-md rounded-none last:rounded-r-md': parent.instance.$name === 'InputGroup' },
            { 'border-0 border-y border-l last:border-r': parent.instance.$name === 'InputGroup' },
            { 'first:ml-0 ml-[-1px]': parent.instance.$name === 'InputGroup' && !props.showButtons },

            // Colors
            'text-surface-600 dark:text-surface-200',
            'placeholder:text-surface-400 dark:placeholder:text-surface-500',
            'bg-surface-0 dark:bg-surface-950',
            'border border-slate-400 dark:border-slate-700',

            // States
            {
                'hover:border-slate-600 dark:hover:border-slate-900': !context.disabled,
                'focus:outline-none focus:outline-offset-0 focus:ring focus:ring-slate-600/50 dark:focus:ring-slate-700/50 focus:z-10': !context.disabled,
                'opacity-60 select-none pointer-events-none cursor-default': context.disabled
            },

            // Misc
            'appearance-none',
            'transition-colors duration-200'
        ]
    }}

}
</script>


<template>
    <InputText :pt="preset" :ptOptions="{ mergeSections: true, mergeProps: false }"/>
</template>
