const ptDialog = {
    root: ({ state }) => ({
        class: [
            // Shape
            "rounded-lg",
            "shadow-lg",
            "border-0",
            "relative",


            // Color
            "dark:border",
            "dark:border-surface-700",

            // Transitions
            "transition-transform",
            "duration-300",
        ],
    }),
    content: ({ state, instance }) => ({
        class: [
            //
            "bg-white overflow-hidden dark:bg-surface-800",
            "max-h-[90vh]",
            "w-[90vw]",
            "max-w-[600px]",
            "pb-[50px]",
        ],
    }),
    mask: {
        class: [
            "transition-all",
            "duration-300",
            "backdrop-blur-none",
            "!bg-transparent",
        ],
    },
};

export default ptDialog;
