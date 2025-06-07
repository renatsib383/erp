const ptDialog = {
  root: ({state}) => ({
    class: [
      // Shape
      "rounded-lg",
      "shadow-lg",
      "border-0",
      "relative",

      // Size
      "max-h-[90vh]",
      "max-sm:w-[95vw]",
      "min-w-[320px]",
      "md:min-w-[700px]",
      "max-w-[95%]",
      "m-0",

      // Color
      "dark:border",
      "dark:border-surface-700",

      // Transitions
      "transition-transform",
      "duration-300",
    ],
  }),
  header: {
    class: [
      "flex items-center justify-between shrink-0 py-2 px-6 max-sm:p-2 relative border-t-0 bg-slate-500 text-white !fill-white stroke-white stroke-2",
    ],
  },
  title: {
    class: ["font-bold text-lg w-1/2 text-white"],
  },
  content: ({state, instance}) => ({
    class: [
      "pt-2 px-4 pb-4 bg-white max-sm:p-2 overflow-y-auto",
    ],
  }),
  mask: {
    class: [
      "transition-all",
      "duration-300",
      "backdrop-blur-none",
      "bg-[#00000066]",
    ],
  },
  transition: ({ props }) => ({
    enterFromClass: "opacity-0 translate-y-full mask-active",
    enterActiveClass: "transition-all duration-300 ease-out",
    leaveActiveClass: "transition-all duration-300 ease-out",
    leaveToClass: "opacity-0 translate-y-full mask-active",
  }),
};

export default ptDialog;
