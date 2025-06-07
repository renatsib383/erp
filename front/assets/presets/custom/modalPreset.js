const ptDialog = {
    root: () => ({
        class: [
            // Shape
            "rounded-lg",
            "border-0",
            "shadow-none",
            "bg-none",
            // Size
            "w-full",
            "h-full",
            // Позиционирование
            "absolute",
            "inset-0", // Занимает всю область mask
            // Color
            // "dark:border",
            // "dark:border-surface-700",

            // Transitions
            "transform",
            "scale-100",
        ],
    }),
    header: {
        class: [
            "flex items-center justify-between shrink-0 py-[4px] max-sm:px-2 px-6 relative border-t-0 bg-modal-header text-nowrap ",
        ],
    },
    title: {
        class: ["font-bold text-lg w-1/2 text-white"],
    },
    content: () => ({
        class: [
            "overflow-y-auto h-full",
        ],
    }),
    mask: {
        class: [
            "!absolute w-full h-full",
            "transition-all ease-out",
            "duration-500",
            "backdrop-blur-none",
            "!bg-transparent shadow-none",
        ],
    },
    transition: () => ({
        enterFromClass: "opacity-0 translate-y-full mask-active",
        enterActiveClass: "transition-all duration-300 ease-out",
        leaveActiveClass: "transition-all duration-300 ease-out",
        leaveToClass: "opacity-0 translate-y-full mask-active",
    }),
};

export default ptDialog;
