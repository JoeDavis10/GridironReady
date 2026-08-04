import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./badge-D9EcA40i.mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/progress-CayiJjUR.js
var import_jsx_runtime = require_jsx_runtime();
function Progress({ className, value, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("relative h-2 w-full overflow-hidden rounded-full bg-[var(--color-elevated)]", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
			className: "h-full w-full flex-1 rounded-full bg-[var(--color-primary)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-smooth)]",
			style: { transform: `translateX(-${100 - (value || 0)}%)` }
		})
	});
}
//#endregion
export { Progress as t };
