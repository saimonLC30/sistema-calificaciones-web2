// Logo de la app: una pantalla con un tilde (dibujado en SVG, sin archivos de imagen).
// Usa "currentColor": toma el color del texto donde se coloque (blanco en la barra).
export default function Logo({ tamano = 26 }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M8 10l3 3 5-5" />
    </svg>
  )
}
