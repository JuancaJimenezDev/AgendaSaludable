/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
		'./src/app/**/*.{js,ts,jsx,tsx}',  // Incluir todas las páginas en `app`
		'./src/components/**/*.{js,ts,jsx,tsx}',  // Incluir todos los componentes
		'./src/app/reprogramacion/page.tsx',  // Incluir `page.tsx` de reprogramación
		'./src/app/reprogramacion/useCitas.ts',  // Incluir `useCitas.ts`
	],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

