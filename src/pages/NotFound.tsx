import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-4">
            <div className="text-center">
                <p className="font-serif text-8xl font-bold text-amber-400 mb-4">404</p>
                <h1 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                    Página no encontrada
                </h1>
                <p className="text-stone-500 dark:text-stone-400 mb-8">
                    La página que buscas no existe o fue movida.
                </p>
                <Link
                    to="/"
                    className="px-6 py-3 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 rounded-full font-medium hover:bg-stone-800 dark:hover:bg-amber-400 transition-colors"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}