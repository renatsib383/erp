const ptbaseDialog = {
  root: ({ state }) => ({
    class: [
      // Shape
      "rounded-lg",
      "shadow-lg",
      "border-0",
      // Size
      "max-h-[90vh]",
      "w-[90vw]",
      "max-w-[600px]",
      "m-0",
      // Color
      "dark:border",
      "dark:border-surface-700",
      // Transitions
      "transform",
      "scale-100",
    ],
  }),
  header: {
    class: [
      "flex items-center justify-between",
      "h-[var(--modal-header-height)] bg-modal-header modal-header flex items-center justify-between px-4 text-white",
    ],
  },
  title: {
    class: ["font-normal text-lg"],
  },
  icons: {
    class: ["flex items-center stroke-white"],
  },
  closeButton: {
    class: [
      "relative",
      "flex items-center justify-center",
      "last:mr-0",
      "w-8 h-8",
      "border-0",
      "rounded-full",
      "text-white fill-white stroke-white",
      "bg-transparent",
      "transition duration-200 ease-in-out",
      "hover:text-surface-700 dark:hover:text-white/80",
      "hover:bg-surface-100 dark:hover:bg-surface-800/80",
      "focus:outline-none focus:outline-offset-0 focus:ring focus:ring-inset",
      "focus:ring-primary-400/50 dark:focus:ring-primary-300/50",
      "overflow-hidden",
    ],
  },
  closeButtonIcon: {
    class: ["inline-block text-white fill-white stroke-white", "w-4", "h-4"],
  },
  content: ({ state, instance }) => ({
    class: [
      // Spacing
      "px-0",
      "pb-8",
      "pt-0",
      "min-h-[452px]",
      // Shape
      {
        grow: state.maximized,
      },
      // Colors
      "bg-surface-0 dark:bg-surface-800",
      "text-surface-700 dark:text-surface-0/80",
      // Misc
      "overflow-y-auto",
    ],
  }),
  footer: {
    class: [
      "flex items-center justify-end",
      "shrink-0",
      "text-right",
      "gap-2",
      "px-6",
      "pb-6",
      "border-t-0",
      "rounded-b-lg",
      "bg-surface-0 dark:bg-surface-800",
      "text-surface-700 dark:text-surface-0/80",
    ],
  },
  mask: ({ props }) => ({
    class: [
      // Transitions
      "!absolute",
      "transition-all",
      "duration-300",
      { "p-5": !props.position == "full" },
      // Background and Effects
      "!bg-transparent",
    ],
  }),
  transition: ({ props }) =>
    props.position === "top"
      ? {
          enterFromClass:
            "opacity-0 scale-75 translate-x-0 -translate-y-full translate-z-0 mask-active",
          enterActiveClass: "transition-all duration-200 ease-out",
          leaveActiveClass: "transition-all duration-200 ease-out",
          leaveToClass:
            "opacity-0 scale-75 translate-x-0 -translate-y-full translate-z-0 mask-active",
        }
      : props.position === "bottom"
        ? {
            enterFromClass: "opacity-0 scale-75 translate-y-full mask-active",
            enterActiveClass: "transition-all duration-200 ease-out",
            leaveActiveClass: "transition-all duration-200 ease-out",
            leaveToClass:
              "opacity-0 scale-75 translate-x-0 translate-y-full translate-z-0 mask-active",
          }
        : props.position === "left" ||
            props.position === "topleft" ||
            props.position === "bottomleft"
          ? {
              enterFromClass:
                "opacity-0 scale-75 -translate-x-full translate-y-0 translate-z-0 mask-active",
              enterActiveClass: "transition-all duration-200 ease-out",
              leaveActiveClass: "transition-all duration-200 ease-out",
              leaveToClass:
                "opacity-0 scale-75  -translate-x-full translate-y-0 translate-z-0 mask-active",
            }
          : props.position === "right" ||
              props.position === "topright" ||
              props.position === "bottomright"
            ? {
                enterFromClass:
                  "opacity-0 scale-75 translate-x-full translate-y-0 translate-z-0 mask-active",
                enterActiveClass: "transition-all duration-200 ease-out",
                leaveActiveClass: "transition-all duration-200 ease-out",
                leaveToClass:
                  "opacity-0 scale-75 translate-x-full translate-y-0 translate-z-0 mask-active",
              }
            : {
                enterFromClass: "opacity-0 scale-75 mask-active",
                enterActiveClass: "transition-all duration-200 ease-out",
                leaveActiveClass: "transition-all duration-200 ease-out",
                leaveToClass: "opacity-0 scale-75 mask-active",
              },
};

export default ptbaseDialog;
